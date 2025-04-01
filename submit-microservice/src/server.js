import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import fs from 'fs/promises';
import amqp from 'amqplib';
import submitRoutes from './routes/submitRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';

// Load environment variables
dotenv.config();

// Initialize the express app
const app = express();
app.use(express.json());

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Cache file path (mounted as a Docker volume)
const CACHE_FILE = '/cache/categories.json';

// Connect to RabbitMQ
let channel;
const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672');
        channel = await connection.createChannel();
        const queue = 'SUBMITTED_QUESTIONS';
        await channel.assertQueue(queue, { durable: true });
        console.log('RabbitMQ Connected!');
    } catch (err) {
        console.error('RabbitMQ Connection Failed. Retrying in 5 seconds...');
        setTimeout(connectRabbitMQ, 5000);
    }
};
connectRabbitMQ();

// Fetch categories from Question Microservice and cache them
const fetchAndCacheCategories = async () => {
    try {
        const response = await axios.get('http://question-service:4000/categories');
        const categories = response.data;
        await fs.writeFile(CACHE_FILE, JSON.stringify(categories));
        return categories;
    } catch (err) {
        console.error('Failed to fetch categories from Question Microservice:', err.message);
        try {
            const cachedData = await fs.readFile(CACHE_FILE, 'utf8');
            return JSON.parse(cachedData);
        } catch (cacheErr) {
            console.error('Failed to read cached categories:', cacheErr.message);
            return [];
        }
    }
};

// Override the /categories route to fetch from Question Microservice
app.get('/categories', async (req, res) => {
    const categories = await fetchAndCacheCategories();
    res.json(categories);
});

// Modified submit route to send to RabbitMQ
app.post('/submit', async (req, res) => {
    const { question, answers, category } = req.body;
    if (!question || !answers || !category) {
        return res.status(400).json({ error: 'Question, answers, and category are required' });
    }

    try {
        const message = { question, answers, category };
        channel.sendToQueue('SUBMITTED_QUESTIONS', Buffer.from(JSON.stringify(message)), { persistent: true });
        res.status(200).json({ message: 'Question submitted to queue' });
    } catch (err) {
        console.error('Error sending to queue:', err);
        res.status(500).json({ error: 'Failed to submit question' });
    }
});

// Other routes
app.use('/submit', submitRoutes);

// Swagger setup
const swaggerDocument = yaml.load(await fs.readFile('./swagger.yaml', 'utf8'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => console.log(`Submit service running on port ${PORT}`));
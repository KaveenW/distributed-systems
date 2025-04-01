import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import submitRoutes from './routes/submitRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

// Load environment variables
dotenv.config();
// Initialize the express app
const app = express();
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected!");
    } catch (err) {
        console.error("MongoDB Connection Failed. Retrying in 5 seconds...");
        setTimeout(connectDB, 5000); // Retry after 5 seconds
    }
};

connectDB();

// Get the current directory name using import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Set up routes
app.use('/submit', submitRoutes);
app.use('/categories', categoryRoutes);

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => console.log(`Submit service running on port ${PORT}`));

// const swaggerDocument = yaml.load('./swagger.yaml');
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
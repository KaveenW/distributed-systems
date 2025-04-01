import mongoose from 'mongoose';
import amqp from 'amqplib';
import dotenv from 'dotenv';
import Category from './model/Category.js'; // Updated path
import Question from './model/Question.js'; // Updated path

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected!');
    } catch (err) {
        console.error('MongoDB Connection Failed. Retrying in 5 seconds...', err.message);
        setTimeout(connectDB, 5000);
    }
};
connectDB();

// Connect to RabbitMQ and consume messages
const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672');
        const channel = await connection.createChannel();
        const queue = 'SUBMITTED_QUESTIONS';

        await channel.assertQueue(queue, { durable: true });
        console.log('ETL waiting for messages in', queue);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const message = JSON.parse(msg.content.toString());
                console.log('Received message:', message);

                // Transform and load into MongoDB
                try {
                    const { question, answers, category } = message;

                    // Insert category if it doesn't exist
                    await Category.findOneAndUpdate(
                        { name: category },
                        { name: category },
                        { upsert: true, new: true }
                    );
                    console.log(`Category ${category} ensured in database`);

                    // Insert question
                    await Question.create({ question, answers, category });
                    console.log('Question saved to database:', { question, answers, category });

                    // Acknowledge the message
                    channel.ack(msg);
                } catch (err) {
                    console.error('Error processing message:', err);
                    // Optionally, requeue the message or move to a dead-letter queue
                    channel.nack(msg, false, false);
                }
            }
        }, { noAck: false });
    } catch (err) {
        console.error('RabbitMQ Connection Failed. Retrying in 5 seconds...', err.message);
        setTimeout(connectRabbitMQ, 5000);
    }
};
connectRabbitMQ();

// Start a simple server to indicate the ETL is running
import express from 'express';
const app = express();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`ETL service running on port ${PORT}`));
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import questionRoutes from './routes/questionRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

dotenv.config();
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

// Get directory name (__dirname equivalent in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend files
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/question', questionRoutes);
app.use('/categories', categoryRoutes);

// Start server
const PORT = process.env.PORT || 4000; // Updated to 4000 per the diagram
app.listen(PORT, () => console.log(`Question service running on port ${PORT}`));
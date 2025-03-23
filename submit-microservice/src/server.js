import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import submitRoutes from './routes/submitRoutes.js';

// Load environment variables
dotenv.config();

// Initialize the express app
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the current directory name using import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Set up routes
app.use('/submit', submitRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Submit service running on port ${PORT}`));

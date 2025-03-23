import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import questionRoutes from './routes/questionRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());

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

app.use('/question', questionRoutes);
app.use('/categories', categoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Question service running on port ${PORT}`));

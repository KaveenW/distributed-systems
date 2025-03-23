import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import submitRoutes from './routes/submitRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/submit', submitRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Submit service running on port ${PORT}`));

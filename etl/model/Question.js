import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  category: String,
  question: String,
  answers: [{ text: String, isCorrect: Boolean }],
});

export default mongoose.model('Question', questionSchema);

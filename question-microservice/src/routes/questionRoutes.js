import express from 'express';
import Question from '../models/Question.js';

const router = express.Router();

// Get a random question from a category
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const questions = await Question.find({ category });

    if (questions.length === 0) return res.status(404).json({ message: 'No questions found' });

    res.json(questions[Math.floor(Math.random() * questions.length)]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

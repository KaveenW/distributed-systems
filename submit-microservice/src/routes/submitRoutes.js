import express from 'express';
import Question from '../models/Question.js';
import Category from '../models/Category.js';

const router = express.Router();

// Submit a new question
router.post('/', async (req, res) => {
  try {
    const { category, question, answers } = req.body;
    
    let existingCategory = await Category.findOne({ name: category });
    if (!existingCategory) {
      existingCategory = await Category.create({ name: category });
    }

    const newQuestion = await Question.create({ category, question, answers });
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

import express from 'express';
import Question from '../models/Question.js';

const router = express.Router();

// Helper function to shuffle an array (answers)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

// Get questions by category, with optional count
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;  // Category from URL parameter
    const { count } = req.query;      // Count from query parameter

    // Set default to 1 if no count is specified, limit it to 10 if count is too high
    const limit = count ? Math.min(parseInt(count), 10) : 1;

    // Fetch questions matching the category
    const questions = await Question.aggregate([
      { $match: { category } },        // Filter by category
      { $sample: { size: limit } }     // Randomly sample the specified number of questions
    ]);

    // If no questions were found, return an error
    if (questions.length === 0) return res.status(404).json({ message: 'No questions found' });

    // Randomize the answers for each question
    questions.forEach(question => {
      question.answers = shuffleArray(question.answers);  // Shuffle the answers
    });

    // Return the random questions
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

const express = require('express');
const { generateQuiz, submitQuiz } = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/generate', generateQuiz);
router.post('/submit', submitQuiz);

module.exports = router;

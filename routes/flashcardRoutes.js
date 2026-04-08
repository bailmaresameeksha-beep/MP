const express = require('express');
const { getFlashcards, updateFlashcardReview } = require('../controllers/flashcardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getFlashcards);
router.post('/review', updateFlashcardReview);

module.exports = router;

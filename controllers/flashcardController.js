const Flashcard = require('../models/Flashcard');

exports.getFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ user: req.user._id })
      .populate('topic')
      .sort({ nextReview: 1 })
      .limit(20);

    res.json({
      flashcards,
      count: flashcards.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateFlashcardReview = async (req, res) => {
  try {
    const { flashcardId, wasCorrect } = req.body;
    
    const flashcard = await Flashcard.findOne({ 
      _id: flashcardId, 
      user: req.user._id 
    });

    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    flashcard.reviewCount += 1;

    if (wasCorrect) {
      flashcard.reviewStatus = flashcard.reviewCount > 3 ? 'mastered' : 'learning';
      // Spaced repetition
      const days = flashcard.reviewStatus === 'learning' ? 3 : 7;
      flashcard.nextReview = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    } else {
      flashcard.reviewStatus = 'new';
      flashcard.nextReview = new Date();
    }

    await flashcard.save();

    res.json({ 
      message: 'Review updated',
      flashcard: {
        id: flashcard._id,
        reviewStatus: flashcard.reviewStatus,
        nextReview: flashcard.nextReview
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

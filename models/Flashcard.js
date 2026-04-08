const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  front: { type: String, required: true }, // Question or term
  back: { type: String, required: true }, // Answer or definition
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  fromAttempt: { type: mongoose.Schema.Types.ObjectId, ref: 'Attempt' },
  reviewStatus: { 
    type: String, 
    enum: ['new', 'learning', 'mastered'], 
    default: 'new' 
  },
  nextReview: { type: Date },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flashcard', flashcardSchema);

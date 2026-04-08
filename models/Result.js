/**
 * Result Model
 * Stores quiz results for analytics and history
 */

const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  negativeMarks: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number,
    default: 0
  },
  quizType: {
    type: String,
    enum: ['topic', 'adaptive', 'pdf', 'mock'],
    default: 'topic'
  },
  // Detailed breakdown
  topicPerformance: [{
    topic: String,
    correct: Number,
    total: Number,
    accuracy: Number
  }],
  strongTopics: [{
    topic: String,
    accuracy: Number
  }],
  weakTopics: [{
    topic: String,
    accuracy: Number
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate accuracy static method
resultSchema.statics.calculateAccuracy = function(correct, total) {
  return total > 0 ? ((correct / total) * 100).toFixed(2) : 0;
};

// Index for analytics queries
resultSchema.index({ user: 1, completedAt: -1 });
resultSchema.index({ user: 1, topic: 1 });
resultSchema.index({ user: 1, quizType: 1 });

module.exports = mongoose.model('Result', resultSchema);


const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  title: { type: String, required: true },
  duration: { type: Number, default: 30 }, // minutes
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);

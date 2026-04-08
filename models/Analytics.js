const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  totalAttempts: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  avgScore: { type: Number, default: 0 },
  lastAttempted: { type: Date },
  masteryLevel: { 
    type: String, 
    enum: ['weak', 'average', 'strong'], 
    default: 'weak' 
  },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', analyticsSchema);

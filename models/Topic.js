const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
});

module.exports = mongoose.model('Topic', topicSchema);

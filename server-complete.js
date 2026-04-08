const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Disable helmet CSP
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data: blob:; font-src * data:; connect-src * data: blob:; media-src *;");
  next();
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/flashcards', require('./routes/flashcardRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/pdf', require('./routes/pdfRoutes'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public-complete.html'));
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gatemasterai')
  .catch(err => console.log('MongoDB skipped:', err.message));

app.listen(5001, '0.0.0.0', () => {
  console.log('🚀 Gate Master AI running on http://localhost:5001');
});

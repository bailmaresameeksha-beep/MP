const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/pdf', pdfRoutes);

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile('C:/Users/HP/Desktop/gate-master-ai/public/index.html');
});

// MongoDB
mongoose.connect('mongodb://localhost:27017/gateai')
  .then(() => console.log('MongoDB Connected'))
  .catch(() => console.log('MongoDB error - install MongoDB'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));


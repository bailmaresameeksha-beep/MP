const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Quiz = require('../models/Quiz');
const Flashcard = require('../models/Flashcard');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch (e) {
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/pdf', auth, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    
    const pdfParse = require('pdf-parse');
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;
    
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const summaryPrompt = `Summarize the following text in 5 bullet points:\n\n${text.substring(0, 4000)}`;
    const summaryRes = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: summaryPrompt }]
    });
    const summary = summaryRes.choices[0].message.content;
    
    const quizPrompt = `Generate 10 GATE exam multiple choice questions from this content. 
    Format as JSON array with: question, options (array of 4), correctAnswer (0-3), explanation, concept.\n\n${text.substring(0, 4000)}`;
    
    const quizRes = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: quizPrompt }]
    });
    
    let questions = [];
    try {
      questions = JSON.parse(quizRes.choices[0].message.content);
    } catch (e) {
      questions = [];
    }
    
    const quiz = await Quiz.create({
      user: req.user.id,
      title: `Quiz from ${req.file.originalname}`,
      topic: 'PDF Upload',
      questions,
      totalQuestions: questions.length,
      type: 'pdf'
    });
    
    res.json({ success: true, summary, quiz, filename: req.file.originalname });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

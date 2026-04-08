const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const AIService = require('../services/aiService');
const Question = require('../models/Question');

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

exports.uploadPDF = [
  upload.single('pdf'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No PDF file uploaded' });
      }

      // Parse PDF
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdfParse(dataBuffer);
      const text = data.text;

      // AI Process PDF
      const summary = await AIService.summarizePDF(text);

      // Generate questions from PDF
      const aiQuestions = await AIService.generateQuiz('PDF Content', 5);

      // Save questions
      const questions = await Promise.all(
        aiQuestions.map(async (q) => {
          const question = new Question({
            question: q.question,
            options: q.options.map((opt, idx) => ({
              text: opt,
              isCorrect: q.correctAnswer === String.fromCharCode(65 + idx)
            })),
            explanation: q.explanation
          });
          return await question.save();
        })
      );

      // Delete uploaded file after processing
      fs.unlinkSync(req.file.path);

      res.json({
        message: 'PDF processed successfully',
        summary,
        questions: questions.map(q => ({
          id: q._id,
          question: q.question,
          options: q.options
        })),
        totalQuestions: questions.length
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

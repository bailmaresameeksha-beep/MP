const AIService = require('../services/aiService');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const Flashcard = require('../models/Flashcard');

exports.generateQuiz = async (req, res) => {
  try {
    const { topic, numQuestions = 10, difficulty = 'medium' } = req.body;

    // Generate questions using AI
    const aiQuestions = await AIService.generateQuiz(topic, numQuestions, difficulty);

    // Save questions to DB
    const questions = await Promise.all(
      aiQuestions.map(async (q) => {
        const mongoose = require('mongoose');
        const question = new Question({
          topic: new mongoose.Types.ObjectId(),
          question: q.question,
          options: q.options.map((opt, idx) => ({
            text: opt,
            isCorrect: q.correctAnswer === String.fromCharCode(65 + idx)
          })),
          explanation: q.explanation,
          difficulty
        });
        return await question.save();
      })
    );

    // Create quiz
    const quiz = new Quiz({
      user: req.user._id,
      topic: new mongoose.Types.ObjectId(),
      questions: questions.map(q => q._id),
      title: `Quiz on ${topic}`
    });
    await quiz.save();

    res.json({
      message: 'Quiz generated successfully',
      quiz: {
        id: quiz._id,
        questions: questions.map(q => ({
          id: q._id,
          question: q.question,
          options: q.options,
          explanation: q.explanation
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body; // answers: [{questionId, selectedOptionIndex}]

    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz || String(quiz.user) !== String(req.user._id)) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    const processedAnswers = [];
    const weakQuestions = [];

    for (let ans of answers) {
      const question = quiz.questions.find(q => String(q._id) === ans.questionId);
      if (!question) continue;

      const isCorrect = question.options[ans.selectedOptionIndex]?.isCorrect || false;
      if (isCorrect) score++;

      processedAnswers.push({
        question: question._id,
        selectedOption: ans.selectedOptionIndex,
        isCorrect,
        timeTaken: ans.timeTaken || 0
      });

      if (!isCorrect) {
        weakQuestions.push(question._id);
        // Generate flashcard for wrong answer
        const flashcards = await AIService.generateFlashcards(
          question.question,
          question.options.find(opt => opt.isCorrect)?.text
        );
        for (let card of flashcards) {
          await new Flashcard({
            user: req.user._id,
            front: card.front,
            back: card.back,
            topic: quiz.topic,
            fromAttempt: null // will be set after attempt saved
          }).save();
        }
      }
    }

    const attempt = new Attempt({
      user: req.user._id,
      quiz: quizId,
      answers: processedAnswers,
      score,
      totalQuestions: quiz.questions.length,
      weakQuestions
    });
    await attempt.save();

    const accuracy = (score / quiz.questions.length) * 100;

    res.json({
      message: 'Quiz submitted successfully',
      score,
      accuracy: accuracy.toFixed(2),
      weakQuestions: weakQuestions.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

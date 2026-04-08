const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class AIService {
  static async generateQuiz(topic, numQuestions = 10, difficulty = 'medium') {
    const prompt = `Generate ${numQuestions} GATE exam style MCQ questions on "${topic}" (difficulty: ${difficulty}).
Format each question as JSON object:
{
  "question": "Question text?",
  "options": ["A) opt1", "B) opt2", "C) opt3", "D) opt4"],
  "correctAnswer": "A",
  "explanation": "Detailed explanation why A is correct"
}
Return array of ${numQuestions} such JSON objects.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3
      });

      const content = completion.choices[0].message.content;
      // Parse JSON array from response
      const questions = JSON.parse(content.replace(/```json|```/g, ''));
      return questions;
    } catch (error) {
      console.error('AI Quiz generation error:', error);
      throw new Error('Failed to generate quiz');
    }
  }

  static async generateFlashcards(wrongQuestion, correctAnswer) {
    const prompt = `Create 3 flashcards from this mistake:
Question: ${wrongQuestion}
Correct Answer: ${correctAnswer}

Format as JSON array:
[{"front": "Question/Term", "back": "Answer/Explanation"}]`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Flashcard generation error:', error);
      throw new Error('Failed to generate flashcards');
    }
  }

  static async summarizePDF(text) {
    const prompt = `Create GATE study material from this PDF text (max 500 words):
${text.substring(0, 4000)}

Provide:
1. Key Concepts (bullet points)
2. 5 Important Questions
3. Formulas/Shortcuts`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('PDF summary error:', error);
      throw new Error('Failed to summarize PDF');
    }
  }

  static async solveDoubt(question) {
    const prompt = `Explain this GATE concept doubt clearly:
${question}

Provide:
1. Concept explanation
2. Formula/Method
3. Example
4. Common mistakes`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Doubt solving error:', error);
      throw new Error('Failed to solve doubt');
    }
  }
}

module.exports = AIService;

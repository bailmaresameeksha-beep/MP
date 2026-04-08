# Gate Master AI

AI-powered GATE exam preparation platform with adaptive learning, quiz generation, flashcards, and performance analytics.

## 🚀 Quick Start

1. **Clone/Download** the project
2. **Install MongoDB** locally or use MongoDB Atlas
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create `.env` file** from `.env.example` and add:
   - `MONGODB_URI` (your MongoDB connection string)
   - `JWT_SECRET` (generate a strong secret)
   - `OPENAI_API_KEY` (from OpenAI dashboard)
5. **Start the server**:
   ```bash
   npm run dev  # Development with nodemon
   # or
   npm start    # Production
   ```
6. **Open browser**: http://localhost:5000

## ✨ Features
- ✅ AI-generated topic-wise quizzes
- ✅ PDF upload & smart processing
- ✅ Adaptive learning from mistakes
- ✅ Spaced repetition flashcards
- ✅ Performance dashboard
- ✅ Mock tests with timer
- ✅ AI doubt solver

## 📱 API Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/quiz/generate
POST /api/pdf/upload
GET /api/flashcards
GET /api/analytics/dashboard
```

## 🛠 Tech Stack
- **Backend**: Node.js, Express, MongoDB
- **Frontend**: HTML, Bootstrap, Vanilla JS
- **AI**: OpenAI GPT API
- **Auth**: JWT

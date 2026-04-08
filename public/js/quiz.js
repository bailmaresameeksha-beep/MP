let currentQuiz = null;
let currentQuestionIndex = 0;
let quizTimer = null;
let timeLeft = 1800; // 30 minutes
let userAnswers = [];

async function generateQuiz() {
  const topic = document.getElementById('topic').value;
  const numQuestions = parseInt(document.getElementById('numQuestions').value);
  const difficulty = document.getElementById('difficulty').value;

  if (!topic.trim()) {
    alert('Please enter a topic');
    return;
  }

  document.getElementById('quizForm').style.display = 'none';
  document.getElementById('loading').style.display = 'block'; // Add loading div

  try {
    const data = await apiRequest('/api/quiz/generate', {
      method: 'POST',
      body: JSON.stringify({
        topic,
        numQuestions,
        difficulty
      })
    });

    currentQuiz = data.quiz;
    startQuiz();
  } catch (error) {
    alert('Error generating quiz: ' + error.message);
    document.getElementById('quizForm').style.display = 'block';
  } finally {
    document.getElementById('loading').style.display = 'none';
  }
}

function startQuiz() {
  document.getElementById('quizContainer').style.display = 'block';
  currentQuestionIndex = 0;
  userAnswers = new Array(currentQuiz.questions.length).fill(null);
  timeLeft = 1800;
  
  showQuestion();
  startTimer();
  updateQuestionCounter();
}

function showQuestion() {
  const question = currentQuiz.questions[currentQuestionIndex];
  
  document.getElementById('questions').innerHTML = `
    <div class="quiz-question">
      <h4 class="mb-4">${currentQuestionIndex + 1}. ${question.question}</h4>
      <div class="options">
        ${question.options.map((option, idx) => `
          <button class="btn option-btn w-100 text-start mb-2 p-3" 
                  onclick="selectOption(${idx})" 
                  data-index="${idx}">
            ${option.text}
          </button>
        `).join('')}
      </div>
      <div class="mt-4">
        <div class="explanation text-muted small d-none" id="explanation">
          📝 ${question.explanation}
        </div>
      </div>
    </div>
  `;
}

function selectOption(index) {
  const buttons = document.querySelectorAll('.option-btn');
  buttons.forEach((btn, i) => {
    btn.classList.remove('correct', 'incorrect');
    if (i === index) {
      btn.classList.add('active');
      userAnswers[currentQuestionIndex] = index;
    }
  });
}

function nextQuestion() {
  if (currentQuestionIndex < currentQuiz.questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
    updateQuestionCounter();
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
    updateQuestionCounter();
  }
}

function updateQuestionCounter() {
  document.getElementById('questionCounter').textContent = 
    `Q${currentQuestionIndex + 1}/${currentQuiz.questions.length}`;
  document.getElementById('testProgress').style.width = 
    `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%`;
}

function startTimer() {
  quizTimer = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (timeLeft <= 0) {
      clearInterval(quizTimer);
      submitQuiz();
    }
  }, 1000);
}

async function submitQuiz() {
  clearInterval(quizTimer);
  
  try {
    const response = await apiRequest('/api/quiz/submit', {
      method: 'POST',
      body: JSON.stringify({
        quizId: currentQuiz.id,
        answers: userAnswers.map((ansIdx, qIdx) => ({
          questionId: currentQuiz.questions[qIdx].id,
          selectedOptionIndex: ansIdx,
          timeTaken: 30 // placeholder
        }))
      })
    });

    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    
    document.getElementById('scoreText').innerHTML = 
      `<i class="fas fa-star"></i> Score: ${response.score}/${currentQuiz.questions.length}`;
    document.getElementById('accuracyText').textContent = 
      `Accuracy: ${response.accuracy}% ${response.weakQuestions > 0 ? 
        `( ${response.weakQuestions} new flashcards created )` : ''}`;
    
  } catch (error) {
    alert('Error submitting quiz: ' + error.message);
  }
}

function generateNewQuiz() {
  document.getElementById('quizContainer').style.display = 'none';
  document.getElementById('results').style.display = 'none';
  document.getElementById('quizForm').style.display = 'block';
  document.getElementById('topic').value = '';
}

// Add loading div in HTML
document.addEventListener('DOMContentLoaded', function() {
  // Initialize
});

let flashcards = [];
let currentCardIndex = 0;
let isFlipped = false;

async function loadFlashcards(status = 'new') {
  try {
    const data = await apiRequest(`/api/flashcards?status=${status}`);
    flashcards = data.flashcards;
    document.getElementById('stats').textContent = `${data.count} cards`;
    
    if (flashcards.length === 0) {
      document.getElementById('flashcardsContainer').innerHTML = `
        <div class="text-center py-5">
          <i class="fas fa-inbox fa-4x text-muted mb-3"></i>
          <h5>No flashcards in "${status}"</h5>
          <p class="text-muted">Complete some quizzes to generate flashcards!</p>
        </div>
      `;
      return;
    }
    
    currentCardIndex = 0;
    showCurrentCard();
    updateNavButtons();
  } catch (error) {
    console.error('Flashcards load error:', error);
  }
}

function showCurrentCard() {
  if (flashcards.length === 0) return;
  
  const card = flashcards[currentCardIndex];
  document.getElementById('flashcardsContainer').innerHTML = `
    <div class="flashcard mx-auto" style="max-width: 500px;">
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <h4>${card.front}</h4>
          <small class="text-white-50">
            ${card.topic?.name || 'General'} • 
            Status: <span class="badge bg-light">${card.reviewStatus}</span>
          </small>
        </div>
        <div class="flashcard-back">
          <h4>${card.back}</h4>
          <small>Review #${card.reviewCount} • Next: ${new Date(card.nextReview).toLocaleDateString()}</small>
        </div>
      </div>
    </div>
  `;
  
  isFlipped = false;
  updateFlipButton();
}

function flipCard() {
  const container = document.querySelector('.flashcard');
  container.classList.toggle('flipped');
  isFlipped = !isFlipped;
  updateFlipButton();
}

function updateFlipButton() {
  const btn = document.getElementById('flipBtn');
  btn.textContent = isFlipped ? 'Hide Answer' : 'Show Answer';
  btn.className = isFlipped ? 'btn btn-secondary btn-lg' : 'btn btn-primary btn-lg';
}

function nextCard() {
  if (currentCardIndex < flashcards.length - 1) {
    currentCardIndex++;
    showCurrentCard();
    updateNavButtons();
  }
}

function prevCard() {
  if (currentCardIndex > 0) {
    currentCardIndex--;
    showCurrentCard();
    updateNavButtons();
  }
}

function updateNavButtons() {
  document.getElementById('prevBtn').disabled = currentCardIndex === 0;
  document.getElementById('nextBtn').disabled = currentCardIndex === flashcards.length - 1;
}

async function markCorrect() {
  await reviewCard(true);
  nextCard();
}

async function markWrong() {
  await reviewCard(false);
  nextCard();
}

async function reviewCard(wasCorrect) {
  try {
    await apiRequest('/api/flashcards/review', {
      method: 'POST',
      body: JSON.stringify({
        flashcardId: flashcards[currentCardIndex]._id,
        wasCorrect
      })
    });
  } catch (error) {
    console.error('Review error:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadFlashcards('new');
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevCard();
    if (e.key === 'ArrowRight') nextCard();
    if (e.key === ' ') flipCard();
    if (e.key === 'Enter') markCorrect();
  });
});

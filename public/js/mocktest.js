// Mock test implementation
let testTimer = null;
let testTimeLeft = 0;

async function startMockTest() {
  const duration = parseInt(document.getElementById('duration').value) * 60;
  testTimeLeft = duration;
  
  document.getElementById('testSetup').style.display = 'none';
  document.getElementById('testInterface').style.display = 'block';
  
  // Generate mock test questions (similar to quiz generation)
  startTestTimer();
}

function startTestTimer() {
  testTimer = setInterval(() => {
    testTimeLeft--;
    const minutes = Math.floor(testTimeLeft / 60);
    const seconds = testTimeLeft % 60;
    document.getElementById('testTimer').textContent = 
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (testTimeLeft <= 0) {
      submitTest();
    }
  }, 1000);
}

async function submitTest() {
  clearInterval(testTimer);
  // Calculate final score with negative marking logic
  document.getElementById('testInterface').style.display = 'none';
  document.getElementById('testResults').style.display = 'block';
  
  // Mock results
  document.getElementById('testScore').textContent = 'Score: 45/65';
  document.getElementById('testCorrect').textContent = '45';
  document.getElementById('testWrong').textContent = '15';
  document.getElementById('testPercent').textContent = '69.2%';
}

function restartTest() {
  document.getElementById('testResults').style.display = 'none';
  document.getElementById('testSetup').style.display = 'block';
}

document.getElementById('pdfForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const fileInput = document.getElementById('pdfFile');
  const file = fileInput.files[0];
  
  if (!file) {
    alert('Please select a PDF file');
    return;
  }
  
  const formData = new FormData();
  formData.append('pdf', file);
  
  document.getElementById('loading').style.display = 'block';
  document.querySelector('button[type="submit"]').disabled = true;
  
  try {
    const response = await fetch('/api/pdf/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    // Show results
    document.getElementById('summaryContent').textContent = data.summary;
    document.getElementById('questionCount').textContent = data.questions.length;
    
    document.getElementById('questionsList').innerHTML = data.questions.map((q, idx) => `
      <div class="question-item p-3 border rounded mb-3">
        <h6>${idx + 1}. ${q.question}</h6>
        <div class="options small">
          ${q.options.map(opt => `<span class="badge bg-light me-1">${opt.text}</span>`).join('')}
        </div>
      </div>
    `).join('');
    
    document.getElementById('results').style.display = 'block';
    
  } catch (error) {
    alert('Error processing PDF: ' + error.message);
  } finally {
    document.getElementById('loading').style.display = 'none';
    document.querySelector('button[type="submit"]').disabled = false;
  }
});

async function startQuizFromPDF() {
  // Store questions globally or redirect to quiz page
  alert('Quiz from PDF questions feature - Coming soon!');
}

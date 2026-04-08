let token = localStorage.getItem('token');
let user = JSON.parse(localStorage.getItem('user') || '{}');

const authBtn = document.getElementById('authBtn');
const navbarUserIcon = document.querySelector('.dropdown');

// Update navbar based on auth status
function updateAuthUI() {
  if (token) {
    authBtn.textContent = user.name || user.email;
    authBtn.classList.remove('btn-outline-light');
    authBtn.classList.add('btn-warning');
    authBtn.onclick = logout;
    if (navbarUserIcon) navbarUserIcon.style.display = 'block';
  } else {
    authBtn.textContent = 'Login';
    authBtn.classList.remove('btn-warning');
    authBtn.classList.add('btn-outline-light');
    authBtn.onclick = toggleAuth;
    if (navbarUserIcon) navbarUserIcon.style.display = 'none';
  }
}

function toggleAuth() {
  const modal = new bootstrap.Modal(document.getElementById('authModal'));
  modal.show();
}

async function register(email, password, name) {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password, name})
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    user = data.user;
    token = data.token;
    updateAuthUI();
    bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
    alert('Registration successful!');
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function login(email, password) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password})
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    user = data.user;
    token = data.token;
    updateAuthUI();
    bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
    alert('Login successful!');
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  token = null;
  user = {};
  updateAuthUI();
  alert('Logged out successfully');
}

// Auth form handler
document.addEventListener('DOMContentLoaded', function() {
  updateAuthUI();
  
  const authForm = document.getElementById('authForm');
  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      if (document.getElementById('authTitle').textContent === 'Login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    });
  }
});

// API helper with auth
async function apiRequest(url, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...options
  };
  
  const response = await fetch(url, config);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
}

// Check token validity on load
if (token) {
  // Optionally verify token with server
}

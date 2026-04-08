let analyticsChart = null;
let dashboardData = {};

async function loadDashboard() {
  try {
    const data = await apiRequest('/api/analytics/dashboard');
    dashboardData = data;
    
    // Update stats
    document.getElementById('totalAttempts').textContent = data.stats.totalAttempts;
    document.getElementById('avgAccuracy').textContent = data.stats.avgAccuracy + '%';
    document.getElementById('weakTopics').textContent = data.stats.weakTopics;
    document.getElementById('strongTopics').textContent = data.stats.strongTopics;

    // Update topics list
    const topicsList = document.getElementById('topicsList');
    topicsList.innerHTML = data.analytics.map(topic => `
      <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
        <span>${topic.topic?.name || 'General'}</span>
        <span class="badge ${
          topic.masteryLevel === 'strong' ? 'bg-success' :
          topic.masteryLevel === 'average' ? 'bg-warning' : 'bg-danger'
        }">${topic.avgScore?.toFixed(1)}% ${topic.masteryLevel}</span>
      </div>
    `).join('');

    // Create accuracy chart
    createAccuracyChart(data.analytics);

  } catch (error) {
    console.error('Dashboard load error:', error);
    alert('Please login to view dashboard');
  }
}

function createAccuracyChart(analytics) {
  const ctx = document.getElementById('accuracyChart').getContext('2d');
  
  if (analyticsChart) analyticsChart.destroy();
  
  analyticsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: analytics.map(a => a.topic?.name || 'Quiz').slice(0, 10),
      datasets: [{
        label: 'Accuracy %',
        data: analytics.map(a => a.avgScore).slice(0, 10),
        borderColor: 'rgb(13, 110, 253)',
        backgroundColor: 'rgba(13, 110, 253, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', loadDashboard);

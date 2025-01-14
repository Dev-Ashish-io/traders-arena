// Fetch teams and render them with stylish cards
function fetchTeams() {
  fetch('http://localhost:5000/teams')
      .then(response => response.json())
      .then(data => {
          const teamsDiv = document.querySelector('.teams-container');
          teamsDiv.innerHTML = data.map(team => `
              <div class="team-card fade-in">
                  <h3>${team.name}</h3>
                  <p>💰 Money: $${team.money.toFixed(2)}</p>
                  <p>📈 Stocks: ${JSON.stringify(team.stocks)}</p>
              </div>
          `).join('');
      })
      .catch(error => {
          showErrorModal("Error fetching teams: " + error.message);
      });
}

// Transaction Form Submit Handler
document.getElementById('transactionForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const payload = {
      team_id: document.getElementById('teamId').value,
      stock_name: document.getElementById('stockName').value,
      quantity: parseInt(document.getElementById('quantity').value, 10),
      price: parseFloat(document.getElementById('price').value),
      action: document.getElementById('action').value
  };

  fetch('http://localhost:5000/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
  })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              fetchTeams();
              showModal();
          } else {
              showErrorModal("Transaction failed: " + data.message);
          }
      })
      .catch(error => {
          showErrorModal("Transaction error: " + error.message);
      });
});

// Modal handling functions
function showModal() {
  document.getElementById('transactionModal').classList.remove('hidden');
}

function showErrorModal(message) {
  document.getElementById('errorMessage').textContent = message;
  document.getElementById('errorModal').classList.remove('hidden');
}

// Close modals
document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('transactionModal').classList.add('hidden');
});

document.getElementById('closeErrorModal').addEventListener('click', () => {
  document.getElementById('errorModal').classList.add('hidden');
});

// Fetch teams initially
fetchTeams();
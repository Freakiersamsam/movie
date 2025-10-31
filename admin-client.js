// Admin client for Cinemdle movie management

// Detect if we're running locally
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = isLocal ? 'http://localhost:8787' : 'https://cinemdle-api.samuel-ferland.workers.dev';
const CORRECT_PASSWORD = 'Matin951';

// State
let allMovies = [];
let filteredMovies = [];
let currentEditId = null;
let adminKey = null;

// DOM elements
const loginScreen = document.getElementById('loginScreen');
const adminInterface = document.getElementById('adminInterface');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('passwordInput');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const searchInput = document.getElementById('searchInput');
const difficultyFilter = document.getElementById('difficultyFilter');
const addMovieBtn = document.getElementById('addMovieBtn');
const moviesContainer = document.getElementById('moviesContainer');
const movieModal = document.getElementById('movieModal');
const movieForm = document.getElementById('movieForm');
const modalTitle = document.getElementById('modalTitle');
const cancelBtn = document.getElementById('cancelBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupEventListeners();
});

function setupEventListeners() {
  loginForm.addEventListener('submit', handleLogin);
  logoutBtn.addEventListener('click', handleLogout);
  searchInput.addEventListener('input', filterMovies);
  difficultyFilter.addEventListener('change', filterMovies);
  addMovieBtn.addEventListener('click', showAddMovieModal);
  cancelBtn.addEventListener('click', closeModal);
  movieForm.addEventListener('submit', handleSaveMovie);
  movieModal.addEventListener('click', (e) => {
    if (e.target === movieModal) closeModal();
  });
}

// Authentication
function checkAuth() {
  const stored = localStorage.getItem('cinemdle_admin_key');
  if (stored) {
    adminKey = stored;
    showAdmin();
    loadMovies();
  }
}

function handleLogin(e) {
  e.preventDefault();
  const password = passwordInput.value;

  if (password === CORRECT_PASSWORD) {
    // Generate admin key (in production, this should come from backend)
    adminKey = password;
    localStorage.setItem('cinemdle_admin_key', adminKey);
    loginError.style.display = 'none';
    showAdmin();
    loadMovies();
  } else {
    loginError.textContent = 'Invalid password';
    loginError.style.display = 'block';
    passwordInput.value = '';
  }
}

function handleLogout() {
  localStorage.removeItem('cinemdle_admin_key');
  adminKey = null;
  allMovies = [];
  filteredMovies = [];
  loginScreen.style.display = 'flex';
  adminInterface.style.display = 'none';
  passwordInput.value = '';
}

function showAdmin() {
  loginScreen.style.display = 'none';
  adminInterface.style.display = 'block';
}

// API calls
async function apiCall(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'X-Admin-Key': adminKey,
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'API request failed');
  }

  return response.json();
}

async function loadMovies() {
  try {
    moviesContainer.innerHTML = '<div class="loading">Loading movies...</div>';
    const data = await apiCall('/api/admin/movies');
    allMovies = data.movies;
    filteredMovies = allMovies;
    updateStats();
    renderMovies();
  } catch (error) {
    console.error('Error loading movies:', error);

    // If unauthorized, might be API key issue
    if (error.message.includes('Unauthorized')) {
      moviesContainer.innerHTML = `
        <div class="no-movies">
          <p>❌ Authentication Error</p>
          <p style="margin-top: 10px; font-size: 14px; color: #aaa;">
            The admin API key is not configured properly. Please check the ADMIN_API_KEY secret in the Cloudflare Worker settings.
          </p>
          <button class="btn btn-secondary" onclick="location.reload()" style="margin-top: 20px;">Retry</button>
        </div>
      `;
    } else {
      moviesContainer.innerHTML = `
        <div class="no-movies">
          <p>Error loading movies: ${error.message}</p>
          <button class="btn btn-secondary" onclick="loadMovies()" style="margin-top: 20px;">Retry</button>
        </div>
      `;
    }
  }
}

async function addMovie(movieData) {
  return apiCall('/api/admin/movies', {
    method: 'POST',
    body: JSON.stringify(movieData)
  });
}

async function updateMovie(id, movieData) {
  return apiCall(`/api/admin/movies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(movieData)
  });
}

async function deleteMovie(id) {
  return apiCall(`/api/admin/movies/${id}`, {
    method: 'DELETE'
  });
}

// UI Updates
function updateStats() {
  document.getElementById('totalMovies').textContent = allMovies.length;
  for (let i = 1; i <= 5; i++) {
    const count = allMovies.filter(m => m.difficulty === i).length;
    document.getElementById(`diff${i}Count`).textContent = count;
  }
}

function filterMovies() {
  const search = searchInput.value.toLowerCase();
  const difficulty = difficultyFilter.value;

  filteredMovies = allMovies.filter(movie => {
    const matchesSearch = !search ||
      movie.title.toLowerCase().includes(search) ||
      movie.actor1.toLowerCase().includes(search) ||
      movie.actor2.toLowerCase().includes(search);

    const matchesDifficulty = !difficulty ||
      movie.difficulty === parseInt(difficulty, 10);

    return matchesSearch && matchesDifficulty;
  });

  renderMovies();
}

function renderMovies() {
  if (filteredMovies.length === 0) {
    moviesContainer.innerHTML = `
      <div class="no-movies">
        <p>No movies found</p>
        ${allMovies.length === 0 ? '<button class="btn btn-primary" onclick="showAddMovieModal()">Add Your First Movie</button>' : ''}
      </div>
    `;
    return;
  }

  const html = `
    <div class="movies-table">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Year</th>
            <th>Difficulty</th>
            <th>Actors</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${filteredMovies.map(movie => `
            <tr>
              <td><strong>${escapeHtml(movie.title)}</strong></td>
              <td>${movie.year}</td>
              <td><span class="difficulty-badge difficulty-${movie.difficulty}">Level ${movie.difficulty}</span></td>
              <td>${escapeHtml(movie.actor1)}, ${escapeHtml(movie.actor2)}</td>
              <td>
                <div class="action-btns">
                  <button class="btn btn-primary" onclick="showEditMovieModal(${movie.id})">Edit</button>
                  <button class="btn btn-danger" onclick="confirmDelete(${movie.id}, '${escapeHtml(movie.title)}')">Delete</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  moviesContainer.innerHTML = html;
}

// Modal functions
function showAddMovieModal() {
  currentEditId = null;
  modalTitle.textContent = 'Add Movie';
  movieForm.reset();
  movieModal.classList.add('active');
  document.getElementById('titleInput').focus();
}

function showEditMovieModal(id) {
  const movie = allMovies.find(m => m.id === id);
  if (!movie) return;

  currentEditId = id;
  modalTitle.textContent = 'Edit Movie';

  document.getElementById('titleInput').value = movie.title;
  document.getElementById('yearInput').value = movie.year;
  document.getElementById('difficultyInput').value = movie.difficulty;
  document.getElementById('quote1Input').value = movie.quote1;
  document.getElementById('quote2Input').value = movie.quote2;
  document.getElementById('actor1Input').value = movie.actor1;
  document.getElementById('actor2Input').value = movie.actor2;

  movieModal.classList.add('active');
  document.getElementById('titleInput').focus();
}

function closeModal() {
  movieModal.classList.remove('active');
  movieForm.reset();
  currentEditId = null;
}

async function handleSaveMovie(e) {
  e.preventDefault();

  const movieData = {
    title: document.getElementById('titleInput').value.trim(),
    year: parseInt(document.getElementById('yearInput').value, 10),
    difficulty: parseInt(document.getElementById('difficultyInput').value, 10),
    quote1: document.getElementById('quote1Input').value.trim(),
    quote2: document.getElementById('quote2Input').value.trim(),
    actor1: document.getElementById('actor1Input').value.trim(),
    actor2: document.getElementById('actor2Input').value.trim()
  };

  try {
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    if (currentEditId) {
      await updateMovie(currentEditId, movieData);
    } else {
      await addMovie(movieData);
    }

    closeModal();
    await loadMovies();

    saveBtn.disabled = false;
    saveBtn.textContent = 'Save';
  } catch (error) {
    alert(`Error saving movie: ${error.message}`);
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save';
  }
}

async function confirmDelete(id, title) {
  if (!confirm(`Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`)) {
    return;
  }

  try {
    await deleteMovie(id);
    await loadMovies();
  } catch (error) {
    alert(`Error deleting movie: ${error.message}`);
  }
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Make functions available globally for onclick handlers
window.showAddMovieModal = showAddMovieModal;
window.showEditMovieModal = showEditMovieModal;
window.confirmDelete = confirmDelete;
window.loadMovies = loadMovies;

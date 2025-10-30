// Cinemdle API Client
// Handles communication with Cloudflare Worker backend

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8787/api'
  : 'https://cinemdle-api.samuel-ferland.workers.dev/api';

class CinemdleAPI {
  constructor() {
    this.sessionId = null;
    this.isDev = false;
  }

  /**
   * Check if dev mode is active
   */
  isDevMode() {
    const devFlag = localStorage.getItem('isDev');
    if (devFlag === 'true') return true;

    // Auto-detect dev offset usage
    const devOffset = localStorage.getItem('devOffset');
    if (devOffset && parseInt(devOffset) !== 0) {
      localStorage.setItem('isDev', 'true');
      return true;
    }

    return false;
  }

  /**
   * Initialize session
   */
  async initSession() {
    try {
      // Check if already have session ID
      this.sessionId = localStorage.getItem('sessionId');
      this.isDev = this.isDevMode();

      if (!this.sessionId) {
        const response = await fetch(`${API_BASE_URL}/session/init`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userAgent: navigator.userAgent,
            isDev: this.isDev
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        this.sessionId = data.sessionId;
        localStorage.setItem('sessionId', this.sessionId);
      }

      return { sessionId: this.sessionId, isDev: this.isDev };
    } catch (error) {
      console.warn('Failed to initialize session with API:', error);
      // Generate fallback session ID
      if (!this.sessionId) {
        this.sessionId = 'local-' + Math.random().toString(36).substring(7);
        localStorage.setItem('sessionId', this.sessionId);
      }
      return { sessionId: this.sessionId, isDev: this.isDev };
    }
  }

  /**
   * Get headers for API requests
   */
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-Session-ID': this.sessionId || 'unknown',
      'X-Is-Dev': this.isDev ? '1' : '0'
    };
  }

  /**
   * Get daily movies for a specific date
   * @param {string} date - YYYY-MM-DD format
   * @returns {Promise<Array>} - Array of movies or null on failure
   */
  async getDailyMovies(date) {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/daily?date=${date}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.movies;
    } catch (error) {
      console.warn('Failed to fetch daily movies from API:', error);
      return null; // Fallback to client-side selection
    }
  }

  /**
   * Submit a round result
   * @param {Object} result - { date, difficulty, won, hintsUsed }
   * @returns {Promise<Object|null>} - Response data or null on failure
   */
  async submitResult(result) {
    try {
      const response = await fetch(`${API_BASE_URL}/results/submit`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(result)
      });

      if (!response.ok) {
        // Handle duplicate submission gracefully
        if (response.status === 409) {
          console.log('Result already submitted');
          return null;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Failed to submit result to API:', error);
      return null;
    }
  }

  /**
   * Get global statistics for a specific round
   * @param {string} date - YYYY-MM-DD format
   * @param {number} difficulty - 1-5
   * @returns {Promise<Object|null>} - Stats object or null
   */
  async getGlobalStats(date, difficulty) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/stats/global?date=${date}&difficulty=${difficulty}`,
        {
          method: 'GET',
          headers: this.getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.stats;
    } catch (error) {
      console.warn('Failed to fetch global stats:', error);
      return null;
    }
  }

  /**
   * Get weekly leaderboard
   * @param {string} weekStart - YYYY-MM-DD (Monday)
   * @param {number} limit - Number of top players to fetch
   * @returns {Promise<Object|null>} - Leaderboard data or null
   */
  async getWeeklyLeaderboard(weekStart, limit = 100) {
    try {
      const url = weekStart
        ? `${API_BASE_URL}/leaderboard/weekly?week=${weekStart}&limit=${limit}`
        : `${API_BASE_URL}/leaderboard/weekly?limit=${limit}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Failed to fetch leaderboard:', error);
      return null;
    }
  }

  /**
   * Get player's rank
   * @returns {Promise<Object|null>} - Rank info or null
   */
  async getPlayerRank() {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard/rank`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Failed to fetch player rank:', error);
      return null;
    }
  }

  /**
   * Get daily stats for all difficulties
   * @param {string} date - YYYY-MM-DD format
   * @returns {Promise<Object|null>} - Daily stats or null
   */
  async getDailyStats(date) {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/daily?date=${date}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Failed to fetch daily stats:', error);
      return null;
    }
  }
}

// Create global API client instance
window.cinemAPI = new CinemdleAPI();

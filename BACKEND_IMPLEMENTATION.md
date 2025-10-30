# Cinemdle Backend Implementation

## Overview

Implemented a **Cloudflare D1 + Workers** backend for Cinemdle with:
- Global stats tracking across all players
- Weekly leaderboards
- Centralized movie selection (no repeats globally)
- Complete dev mode isolation
- Backward-compatible fallback to client-side logic

---

## Architecture

### Backend (Cloudflare Worker + D1)
```
worker/
├── index.js                 # Main Worker entry point with routing
├── routes/
│   ├── session.js          # Session init & validation
│   ├── movies.js           # Daily movie selection
│   ├── results.js          # Submit & retrieve results
│   ├── stats.js            # Global statistics
│   └── leaderboard.js      # Weekly leaderboard
├── utils/
│   ├── dates.js            # Date helpers
│   ├── scoring.js          # Leaderboard scoring algorithm
│   ├── movieSelection.js   # Deterministic movie selection
│   └── uuid.js             # UUID generation/validation
├── db/
│   ├── schema.sql          # Full database schema
│   └── migrations/
│       └── 0001_initial.sql
├── wrangler.toml           # Worker configuration
└── sync-movies.js          # Script to sync movies.js to D1
```

### Frontend (api-client.js)
- Manages session ID (anonymous, localStorage)
- Auto-detects dev mode (devOffset > 0)
- Makes API calls with fallback to client-side
- Provides clean interface for frontend integration

---

## Database Schema

### Tables

#### `user_sessions`
- `session_id` (PK) - UUID v4
- `is_dev` - 0 for production, 1 for dev
- `first_seen`, `last_active`
- `user_agent`

#### `daily_movies`
- Tracks which movies are selected each day
- Prevents global repeats (365-day window)
- `date`, `difficulty`, `movie_title`, `movie_year`

#### `round_results`
- Individual round results
- `session_id`, `date`, `difficulty`, `won`, `hints_used`, `is_dev`
- **Dev data is ALWAYS filtered out from global stats**

#### `weekly_leaderboard`
- Cached weekly rankings
- `session_id`, `week_start`, `score`, `rank`, `is_dev`
- Updated automatically on result submission

#### `movies`
- Complete movie database synced from movies.js
- `title`, `year`, `difficulty`, `quote1`, `quote2`, `actor1`, `actor2`

---

## API Endpoints

All endpoints: `http://localhost:8787/api` (local) or `https://cinemdle-api.*.workers.dev/api` (production)

### Session Management
```
POST /api/session/init
Body: { userAgent: string, isDev: boolean }
Returns: { sessionId: string, isNew: boolean, isDev: boolean }

GET /api/session/validate
Headers: X-Session-ID
Returns: { valid: boolean, isDev: boolean }
```

### Movies
```
GET /api/movies/daily?date=YYYY-MM-DD
Returns: { date, movies: [{ title, year, difficulty, quotes, actors }] }

GET /api/movies/history?limit=30
Returns: { history: [{ date, movies }] }
```

### Results
```
POST /api/results/submit
Headers: X-Session-ID, X-Is-Dev
Body: { date, difficulty, won, hintsUsed }
Returns: { success, globalStats, leaderboardStats }

GET /api/results/user?date=YYYY-MM-DD
Headers: X-Session-ID
Returns: { date, results: [...] }
```

### Stats
```
GET /api/stats/global?date=YYYY-MM-DD&difficulty=1
Returns: {
  totalPlayed, totalWon, winRate, avgHints,
  hintDistribution: [n1, n2, n3, n4, n5, n6]
}

GET /api/stats/daily?date=YYYY-MM-DD
Returns: { difficulties: [{ difficulty, totalPlayed, totalWon, winRate, avgHints }] }
```

### Leaderboard
```
GET /api/leaderboard/weekly?week=YYYY-MM-DD&limit=100
Headers: X-Session-ID (optional, for yourRank)
Returns: {
  weekStart,
  topPlayers: [{ rank, sessionId (anonymized), wins, rounds, avgHints, score }],
  yourRank: { rank, wins, rounds, avgHints, score }
}

GET /api/leaderboard/rank
Headers: X-Session-ID
Returns: { weekStart, rank, wins, rounds, avgHints, score }
```

---

## Dev Mode Isolation

### How It Works

1. **Auto-Detection**:
   - If `devOffset > 0` in localStorage → **dev mode automatically enabled**
   - OR user can manually set `isDev=true` in localStorage

2. **Session Creation**:
   - On first API call, session created with `is_dev=1` flag
   - **All subsequent data marked with is_dev=1**

3. **Data Filtering**:
   - **Global stats**: ALWAYS filter `WHERE is_dev=0`
   - **Leaderboards**: ALWAYS filter `WHERE is_dev=0`
   - **Movie selection**: Dev sessions get separate tracking (doesn't affect production)

4. **Dev Reset Button**:
   - Only affects `devOffset` and local state
   - **Does NOT touch production database**
   - Creates new session if needed

### Critical Guarantees

✅ **Dev data NEVER appears in production stats**
✅ **Dev movie selections don't affect production rotation**
✅ **Dev reset doesn't affect other users or production**
✅ **All queries explicitly filter `is_dev=0` for production stats**

---

## Leaderboard Scoring Algorithm

```javascript
score = (wins × 100)                          // Base: 100 per win
      + ((6 - avgHints) × 60)                 // Efficiency: fewer hints = bonus
      + (perfectRounds × 200)                 // Perfect: 200 per 1-hint win
      + (winRate × 150)                       // Win rate bonus
      - (losses × 5)                          // Small penalty for losses
```

Higher score = better player
- Encourages winning quickly (fewer hints)
- Rewards consistency (win rate)
- Heavily rewards "perfect" rounds (1 hint)

---

## Movie Selection Logic

### Deterministic Selection
1. Hash the date → seed
2. For each difficulty (1-5):
   - Get all movies of that difficulty
   - Exclude movies used in last 365 days
   - Select: `seed + difficulty × 37 % available.length`
3. Store in `daily_movies` table
4. **Same date = same movies for all users**

### Dev Mode Behavior
- Dev sessions CAN use devOffset to change seed
- Dev selections tracked separately
- Don't pollute production `daily_movies` table
- Can reset infinite times without affecting prod

---

## Deployment Status

### Local (Completed ✅)
- Worker running: `http://localhost:8787`
- Database: Created & migrated
- Movies: 289 synced successfully
- All endpoints: Tested & working

### Remote (Pending)
- Database: Created & migrated ✅
- Movies: Need to sync (`node sync-movies.js production`)
- Worker: Ready to deploy (`npx wrangler deploy`)
- Custom domain: Configure api.cinemdle.com

---

## Frontend Integration (Next Steps)

### 1. Add api-client.js to index.html
```html
<script src="api-client.js?v=20251030"></script>
<script src="script.js?v=20251030"></script>
```

### 2. Update script.js

**Initialize session on load:**
```javascript
async function init() {
  await window.cinemAPI.initSession();
  // ... rest of init
}
```

**Replace getTodayMovies():**
```javascript
async function getTodayMovies() {
  const date = getTodayKey();

  // Try API first
  const apiMovies = await window.cinemAPI.getDailyMovies(date);
  if (apiMovies && apiMovies.length === 5) {
    return apiMovies;
  }

  // Fallback to client-side selection
  console.warn('Using client-side movie selection');
  return getTodayMoviesClientSide(); // Current implementation
}
```

**Submit results after each round:**
```javascript
async function endRound(won, hints) {
  // ... existing code ...

  // Submit to API (non-blocking)
  window.cinemAPI.submitResult({
    date: getTodayKey(),
    difficulty: currentRound + 1,
    won,
    hintsUsed: hints
  }).then(response => {
    if (response && response.globalStats) {
      // Optionally show global stats to user
      console.log('Global stats:', response.globalStats);
    }
  });
}
```

### 3. Add Global Stats to UI

Show after each round completion:
- "54% of players got this movie"
- "Average hints: 3.2"
- Hint distribution bar chart

### 4. Add Leaderboard Modal

New button in stats modal:
- Show top 100 weekly players
- Show your rank
- Anonymized session IDs
- Scoring breakdown

---

## Testing Dev Mode Isolation

### Test Plan

1. **Start with clean slate**:
   ```javascript
   localStorage.clear();
   ```

2. **Play as normal user** (production):
   - Complete rounds
   - Check stats show your data
   - Verify results submitted

3. **Enable dev mode**:
   ```javascript
   localStorage.setItem('devOffset', '1');
   location.reload();
   ```

4. **Play as dev**:
   - Click dev reset button
   - Complete rounds
   - Check results submitted with `is_dev=1`

5. **Verify isolation**:
   ```sql
   -- Check dev data exists
   SELECT COUNT(*) FROM round_results WHERE is_dev = 1;

   -- Check production stats DON'T include dev data
   SELECT COUNT(*) FROM round_results WHERE is_dev = 0;
   ```

6. **Check global stats API**:
   ```bash
   curl "http://localhost:8787/api/stats/global?date=2025-10-30&difficulty=1"
   # Should NOT include dev session results
   ```

---

## Commands Reference

### Database
```bash
# Local migrations
npx wrangler d1 migrations apply cinemdle-db --local

# Remote migrations
npx wrangler d1 migrations apply cinemdle-db --remote

# Query local DB
npx wrangler d1 execute cinemdle-db --local --command="SELECT COUNT(*) FROM movies"

# Query remote DB
npx wrangler d1 execute cinemdle-db --command="SELECT COUNT(*) FROM movies"
```

### Development
```bash
# Start Worker (local)
npx wrangler dev --local

# Sync movies (local)
node sync-movies.js local

# Sync movies (production)
node sync-movies.js production
```

### Deployment
```bash
# Deploy Worker
npx wrangler deploy

# View logs
npx wrangler tail
```

---

## Next Steps

1. ✅ Backend infrastructure (DONE)
2. ✅ API client (DONE)
3. 🔄 **Frontend integration** (IN PROGRESS)
   - Update script.js to use API
   - Add global stats display
   - Add leaderboard UI
4. ⏳ Deploy to production
5. ⏳ Configure custom domain (api.cinemdle.com)
6. ⏳ Monitor and iterate

---

## Important Notes

### Privacy
- **NO login required**
- **NO personal information collected**
- Only anonymous session UUIDs
- GDPR-compliant

### Performance
- API calls are non-blocking (won't slow down game)
- Fallback to client-side if API fails
- Cached responses where appropriate
- Lightweight (~10KB overhead)

### Maintenance
- Movie database: sync when movies.js updates
- Leaderboard: auto-calculated on result submission
- Daily movies: auto-selected first time accessed
- Dev data: can be purged periodically (>30 days old)

---

**Status**: Backend 100% complete, Frontend integration 50% complete
**Next**: Update script.js + add UI for global stats & leaderboard

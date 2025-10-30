-- Cinemdle Database Schema
-- SQLite (Cloudflare D1)

-- Track daily movie selections (prevents repeats)
CREATE TABLE IF NOT EXISTS daily_movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,           -- YYYY-MM-DD
    difficulty INTEGER NOT NULL,   -- 1-5
    movie_title TEXT NOT NULL,
    movie_year INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, difficulty)
);
CREATE INDEX IF NOT EXISTS idx_daily_movies_date ON daily_movies(date);
CREATE INDEX IF NOT EXISTS idx_daily_movies_title ON daily_movies(movie_title);

-- Anonymous user sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id TEXT PRIMARY KEY,   -- UUID v4
    is_dev INTEGER DEFAULT 0,      -- 1 for dev, 0 for production
    first_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessions_dev ON user_sessions(is_dev);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON user_sessions(last_active);

-- Individual round results
CREATE TABLE IF NOT EXISTS round_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    date TEXT NOT NULL,            -- YYYY-MM-DD
    difficulty INTEGER NOT NULL,   -- 1-5
    won INTEGER NOT NULL,          -- 0 or 1
    hints_used INTEGER NOT NULL,   -- 1-6
    is_dev INTEGER DEFAULT 0,      -- 0 for production, 1 for dev
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
);
CREATE INDEX IF NOT EXISTS idx_results_session ON round_results(session_id, date);
CREATE INDEX IF NOT EXISTS idx_results_global ON round_results(date, difficulty, is_dev);
CREATE INDEX IF NOT EXISTS idx_results_weekly ON round_results(date, is_dev);

-- Weekly leaderboard cache (updated periodically)
CREATE TABLE IF NOT EXISTS weekly_leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    week_start TEXT NOT NULL,      -- Monday of week (YYYY-MM-DD)
    total_rounds INTEGER DEFAULT 0,
    total_wins INTEGER DEFAULT 0,
    total_hints INTEGER DEFAULT 0,
    perfect_rounds INTEGER DEFAULT 0, -- Won with 1 hint
    score INTEGER DEFAULT 0,        -- Calculated score
    rank INTEGER,
    is_dev INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(session_id, week_start)
);
CREATE INDEX IF NOT EXISTS idx_leaderboard_week ON weekly_leaderboard(week_start, is_dev, score DESC);

-- Movie database cache (synced from movies.js)
CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL UNIQUE,
    year INTEGER NOT NULL,
    difficulty INTEGER NOT NULL,
    quote1 TEXT NOT NULL,
    quote2 TEXT NOT NULL,
    actor1 TEXT NOT NULL,
    actor2 TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_movies_difficulty ON movies(difficulty);
CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title);

-- Migration: Initial database setup
-- Created: 2025-10-30

-- Track daily movie selections (prevents repeats)
CREATE TABLE daily_movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    difficulty INTEGER NOT NULL,
    movie_title TEXT NOT NULL,
    movie_year INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, difficulty)
);
CREATE INDEX idx_daily_movies_date ON daily_movies(date);
CREATE INDEX idx_daily_movies_title ON daily_movies(movie_title);

-- Anonymous user sessions
CREATE TABLE user_sessions (
    session_id TEXT PRIMARY KEY,
    is_dev INTEGER DEFAULT 0,
    first_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT
);
CREATE INDEX idx_sessions_dev ON user_sessions(is_dev);
CREATE INDEX idx_sessions_active ON user_sessions(last_active);

-- Individual round results
CREATE TABLE round_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    date TEXT NOT NULL,
    difficulty INTEGER NOT NULL,
    won INTEGER NOT NULL,
    hints_used INTEGER NOT NULL,
    is_dev INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
);
CREATE INDEX idx_results_session ON round_results(session_id, date);
CREATE INDEX idx_results_global ON round_results(date, difficulty, is_dev);
CREATE INDEX idx_results_weekly ON round_results(date, is_dev);

-- Weekly leaderboard cache
CREATE TABLE weekly_leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    week_start TEXT NOT NULL,
    total_rounds INTEGER DEFAULT 0,
    total_wins INTEGER DEFAULT 0,
    total_hints INTEGER DEFAULT 0,
    perfect_rounds INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0,
    rank INTEGER,
    is_dev INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(session_id, week_start)
);
CREATE INDEX idx_leaderboard_week ON weekly_leaderboard(week_start, is_dev, score DESC);

-- Movie database cache
CREATE TABLE movies (
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
CREATE INDEX idx_movies_difficulty ON movies(difficulty);
CREATE INDEX idx_movies_title ON movies(title);

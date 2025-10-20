// Movie database
const MOVIES = [
    {
        quotes: [
            "You're gonna need a bigger boat.",
            "I can't see you coming back here.",
            "We're gonna need a bigger boat."
        ],
        actors: ["Roy Scheider", "Richard Dreyfuss"],
        year: "1975",
        title: "Jaws"
    },
    {
        quotes: [
            "Here's looking at you, kid.",
            "We'll always have Paris.",
            "Louis, I think this is the beginning of a beautiful friendship."
        ],
        actors: ["Humphrey Bogart", "Ingrid Bergman"],
        year: "1942",
        title: "Casablanca"
    },
    {
        quotes: [
            "I'll have what she's having.",
            "When you realize you want to spend the rest of your life with somebody, you want the rest of your life to start as soon as possible.",
            "You're the worst kind. You're high maintenance but you think you're low maintenance."
        ],
        actors: ["Meg Ryan", "Billy Crystal"],
        year: "1989",
        title: "When Harry Met Sally"
    },
    {
        quotes: [
            "May the Force be with you.",
            "I find your lack of faith disturbing.",
            "These aren't the droids you're looking for."
        ],
        actors: ["Mark Hamill", "Harrison Ford"],
        year: "1977",
        title: "Star Wars"
    },
    {
        quotes: [
            "I'm going to make him an offer he can't refuse.",
            "Leave the gun. Take the cannoli.",
            "It's not personal, Sonny. It's strictly business."
        ],
        actors: ["Marlon Brando", "Al Pacino"],
        year: "1972",
        title: "The Godfather"
    },
    {
        quotes: [
            "Nobody puts Baby in a corner.",
            "I carried a watermelon.",
            "Me? I'm scared of everything. I'm scared of what I saw, I'm scared of what I did, of who I am."
        ],
        actors: ["Patrick Swayze", "Jennifer Grey"],
        year: "1987",
        title: "Dirty Dancing"
    },
    {
        quotes: [
            "You can't handle the truth!",
            "I want the truth!",
            "Did you order the Code Red?"
        ],
        actors: ["Jack Nicholson", "Tom Cruise"],
        year: "1992",
        title: "A Few Good Men"
    },
    {
        quotes: [
            "Life is like a box of chocolates. You never know what you're gonna get.",
            "My mama always said life was like a box of chocolates.",
            "Run, Forrest, run!"
        ],
        actors: ["Tom Hanks", "Robin Wright"],
        year: "1994",
        title: "Forrest Gump"
    },
    {
        quotes: [
            "I see dead people.",
            "They don't know they're dead.",
            "Some magic's real."
        ],
        actors: ["Haley Joel Osment", "Bruce Willis"],
        year: "1999",
        title: "The Sixth Sense"
    },
    {
        quotes: [
            "You talking to me?",
            "Are you talking to me?",
            "Someday a real rain will come and wash all this scum off the streets."
        ],
        actors: ["Robert De Niro", "Jodie Foster"],
        year: "1976",
        title: "Taxi Driver"
    }
];

// Game state
let currentHint = 0;
let gameComplete = false;
let todayMovie = null;

// Get today's movie based on date
function getTodayMovie() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    const movieIndex = daysSinceEpoch % MOVIES.length;
    return MOVIES[movieIndex];
}

// Get today's date as a string key
function getTodayKey() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

// Load game state from localStorage
function loadGameState() {
    const todayKey = getTodayKey();
    const savedState = localStorage.getItem('gameState');

    if (savedState) {
        const state = JSON.parse(savedState);
        if (state.date === todayKey) {
            return state;
        }
    }

    return {
        date: todayKey,
        currentHint: 0,
        complete: false,
        won: false,
        hintsRevealed: []
    };
}

// Save game state to localStorage
function saveGameState(state) {
    localStorage.setItem('gameState', JSON.stringify(state));
}

// Load or initialize stats
function loadStats() {
    const savedStats = localStorage.getItem('stats');
    if (savedStats) {
        return JSON.parse(savedStats);
    }

    return {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        guessDistribution: [0, 0, 0, 0, 0, 0, 0],
        lastPlayedDate: null
    };
}

// Save stats to localStorage
function saveStats(stats) {
    localStorage.setItem('stats', JSON.stringify(stats));
}

// Update stats after game completion
function updateStats(won, hintsUsed) {
    const stats = loadStats();
    const todayKey = getTodayKey();

    stats.gamesPlayed++;

    if (won) {
        stats.gamesWon++;
        stats.guessDistribution[hintsUsed]++;

        // Update streak
        if (stats.lastPlayedDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;

            if (stats.lastPlayedDate === yesterdayKey) {
                stats.currentStreak++;
            } else {
                stats.currentStreak = 1;
            }
        } else {
            stats.currentStreak = 1;
        }

        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    } else {
        stats.currentStreak = 0;
    }

    stats.lastPlayedDate = todayKey;
    saveStats(stats);
}

// Initialize game
function initGame() {
    todayMovie = getTodayMovie();
    const state = loadGameState();

    currentHint = state.currentHint;
    gameComplete = state.complete;

    // Restore revealed hints
    state.hintsRevealed.forEach((content, index) => {
        revealHint(index, content, false);
    });

    if (gameComplete) {
        endGame(state.won, currentHint);
    } else {
        // Make first hint clickable if no hints revealed yet
        if (currentHint === 0) {
            makeHintClickable(0);
        }
    }

    // Set up event listeners
    setupEventListeners();

    // Update countdown
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('guess-btn').addEventListener('click', handleGuess);
    document.getElementById('skip-btn').addEventListener('click', handleSkip);
    document.getElementById('guess-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleGuess();
        }
    });

    // Modal controls
    document.getElementById('stats-btn').addEventListener('click', showStats);
    document.getElementById('help-btn').addEventListener('click', showHelp);

    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('show');
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });

    document.getElementById('share-btn').addEventListener('click', shareResults);
}

// Make a hint clickable
function makeHintClickable(index) {
    const hintElement = document.getElementById(`hint-${index}`);
    hintElement.classList.add('clickable');
    hintElement.addEventListener('click', () => {
        if (!gameComplete && currentHint === index) {
            unlockHint(index);
        }
    });
}

// Unlock a hint
function unlockHint(index) {
    const hints = [
        todayMovie.quotes[0],
        todayMovie.quotes[1],
        todayMovie.quotes[2],
        todayMovie.actors[0],
        todayMovie.actors[1],
        todayMovie.year,
        todayMovie.title
    ];

    revealHint(index, hints[index], true);

    // Save state
    const state = loadGameState();
    state.hintsRevealed.push(hints[index]);
    state.currentHint = currentHint;
    saveGameState(state);

    // If this was the last hint (title revealed), game is over
    if (index === 6) {
        endGame(false, currentHint);
    } else {
        // Make next hint clickable
        currentHint++;
        makeHintClickable(currentHint);
    }
}

// Reveal a hint (without unlocking logic)
function revealHint(index, content, animate) {
    const hintElement = document.getElementById(`hint-${index}`);
    const contentElement = hintElement.querySelector('.hint-content');

    hintElement.classList.remove('clickable');
    hintElement.classList.add('unlocked');
    contentElement.classList.remove('locked');
    contentElement.textContent = content;

    if (animate) {
        contentElement.style.opacity = '0';
        setTimeout(() => {
            contentElement.style.transition = 'opacity 0.3s';
            contentElement.style.opacity = '1';
        }, 50);
    }
}

// Handle guess
function handleGuess() {
    if (gameComplete) return;

    const input = document.getElementById('guess-input');
    const guess = input.value.trim().toLowerCase();

    if (!guess) {
        showMessage('Please enter a guess', 'error');
        return;
    }

    const answer = todayMovie.title.toLowerCase();

    if (guess === answer) {
        // Correct guess!
        revealHint(6, todayMovie.title, true);
        endGame(true, currentHint);
    } else {
        showMessage('Incorrect! Try again or reveal another hint', 'error');
        input.value = '';
    }
}

// Handle skip (reveal next hint)
function handleSkip() {
    if (gameComplete || currentHint >= 6) return;
    unlockHint(currentHint);
}

// End game
function endGame(won, hintsUsed) {
    gameComplete = true;

    // Update state
    const state = loadGameState();
    state.complete = true;
    state.won = won;
    saveGameState(state);

    // Update stats
    updateStats(won, hintsUsed);

    // Disable input
    document.getElementById('guess-input').disabled = true;
    document.getElementById('guess-btn').disabled = true;
    document.getElementById('skip-btn').disabled = true;

    // Show message
    if (won) {
        const messages = [
            'Genius! Got it immediately! 🎬',
            'Brilliant! Only needed one hint! ⭐',
            'Excellent! 🎯',
            'Great job! 👏',
            'Well done! 🎥',
            'Nice! You got it! 🎞️',
            'Correct! 🎉'
        ];
        showMessage(messages[hintsUsed], 'success');
    } else {
        showMessage(`The answer was: ${todayMovie.title}`, 'success');
    }

    // Show countdown
    document.getElementById('next-game').classList.add('show');

    // Auto-show stats after a delay
    setTimeout(showStats, 2000);
}

// Show message
function showMessage(text, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;

    if (type === 'error') {
        setTimeout(() => {
            messageElement.className = 'message';
            messageElement.textContent = '';
        }, 3000);
    }
}

// Update countdown to next game
function updateCountdown() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown').textContent =
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Show stats modal
function showStats() {
    const stats = loadStats();

    document.getElementById('games-played').textContent = stats.gamesPlayed;
    document.getElementById('win-percentage').textContent =
        stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
    document.getElementById('current-streak').textContent = stats.currentStreak;
    document.getElementById('max-streak').textContent = stats.maxStreak;

    // Show distribution
    const distributionElement = document.getElementById('distribution');
    distributionElement.innerHTML = '';

    const maxCount = Math.max(...stats.guessDistribution, 1);
    const state = loadGameState();

    stats.guessDistribution.forEach((count, index) => {
        const bar = document.createElement('div');
        bar.className = 'distribution-bar';

        const label = document.createElement('div');
        label.className = 'distribution-label';
        label.textContent = index + 1;

        const fill = document.createElement('div');
        fill.className = 'distribution-fill';
        if (state.complete && state.won && state.currentHint === index) {
            fill.classList.add('current');
        }
        fill.style.width = `${Math.max((count / maxCount) * 100, count > 0 ? 10 : 0)}%`;
        fill.textContent = count;

        bar.appendChild(label);
        bar.appendChild(fill);
        distributionElement.appendChild(bar);
    });

    document.getElementById('stats-modal').classList.add('show');
}

// Show help modal
function showHelp() {
    document.getElementById('help-modal').classList.add('show');
}

// Share results
function shareResults() {
    const state = loadGameState();

    if (!state.complete) {
        showMessage('Complete the game first!', 'error');
        return;
    }

    const stats = loadStats();
    const hintsUsed = state.currentHint + 1;

    let text = `Cinemdle ${getTodayKey()}\n`;

    if (state.won) {
        text += `${hintsUsed}/7 🎬\n\n`;
    } else {
        text += `X/7 🎬\n\n`;
    }

    // Show hint progression
    for (let i = 0; i < 7; i++) {
        if (i < hintsUsed) {
            if (i === state.currentHint && state.won) {
                text += '🟩';
            } else {
                text += '🟨';
            }
        } else {
            text += '⬜';
        }
    }

    navigator.clipboard.writeText(text).then(() => {
        const shareBtn = document.getElementById('share-btn');
        const originalText = shareBtn.textContent;
        shareBtn.textContent = 'Copied!';
        setTimeout(() => {
            shareBtn.textContent = originalText;
        }, 2000);
    }).catch(() => {
        showMessage('Failed to copy to clipboard', 'error');
    });
}

// Start the game
initGame();

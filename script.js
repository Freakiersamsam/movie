const MOVIES = [
    {
        quotes: [
            "You're gonna need a bigger boat.",
            "I can't see you coming back here."
        ],
        actors: ["Roy Scheider", "Richard Dreyfuss"],
        year: "1975",
        title: "Jaws"
    },
    {
        quotes: [
            "Here's looking at you, kid.",
            "We'll always have Paris."
        ],
        actors: ["Humphrey Bogart", "Ingrid Bergman"],
        year: "1942",
        title: "Casablanca"
    },
    {
        quotes: [
            "I'll have what she's having.",
            "When you realize you want to spend the rest of your life with somebody, you want the rest of your life to start as soon as possible."
        ],
        actors: ["Meg Ryan", "Billy Crystal"],
        year: "1989",
        title: "When Harry Met Sally"
    },
    {
        quotes: [
            "May the Force be with you.",
            "I find your lack of faith disturbing."
        ],
        actors: ["Mark Hamill", "Harrison Ford"],
        year: "1977",
        title: "Star Wars"
    },
    {
        quotes: [
            "I'm going to make him an offer he can't refuse.",
            "Leave the gun. Take the cannoli."
        ],
        actors: ["Marlon Brando", "Al Pacino"],
        year: "1972",
        title: "The Godfather"
    },
    {
        quotes: [
            "Nobody puts Baby in a corner.",
            "I carried a watermelon."
        ],
        actors: ["Patrick Swayze", "Jennifer Grey"],
        year: "1987",
        title: "Dirty Dancing"
    },
    {
        quotes: [
            "You can't handle the truth!",
            "I want the truth!"
        ],
        actors: ["Jack Nicholson", "Tom Cruise"],
        year: "1992",
        title: "A Few Good Men"
    },
    {
        quotes: [
            "Life is like a box of chocolates. You never know what you're gonna get.",
            "My mama always said life was like a box of chocolates."
        ],
        actors: ["Tom Hanks", "Robin Wright"],
        year: "1994",
        title: "Forrest Gump"
    },
    {
        quotes: [
            "I see dead people.",
            "They don't know they're dead."
        ],
        actors: ["Haley Joel Osment", "Bruce Willis"],
        year: "1999",
        title: "The Sixth Sense"
    },
    {
        quotes: [
            "You talking to me?",
            "Are you talking to me?"
        ],
        actors: ["Robert De Niro", "Jodie Foster"],
        year: "1976",
        title: "Taxi Driver"
    }
];

let currentHint = 0;
let gameComplete = false;
let todayMovie = null;

function getTodayMovie() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    return MOVIES[daysSinceEpoch % MOVIES.length];
}

function getTodayKey() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

function loadState() {
    const saved = localStorage.getItem('state');
    if (saved) {
        const state = JSON.parse(saved);
        if (state.date === getTodayKey()) return state;
    }
    return {
        date: getTodayKey(),
        hint: 0,
        complete: false,
        won: false
    };
}

function saveState(state) {
    localStorage.setItem('state', JSON.stringify(state));
}

function loadStats() {
    const saved = localStorage.getItem('stats');
    if (saved) return JSON.parse(saved);
    return {
        played: 0,
        won: 0,
        streak: 0,
        maxStreak: 0,
        dist: [0, 0, 0, 0, 0, 0],
        lastDate: null
    };
}

function saveStats(stats) {
    localStorage.setItem('stats', JSON.stringify(stats));
}

function updateStats(won, hints) {
    const stats = loadStats();
    const today = getTodayKey();

    stats.played++;

    if (won) {
        stats.won++;
        stats.dist[hints]++;

        if (stats.lastDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;

            if (stats.lastDate === yesterdayKey) {
                stats.streak++;
            } else {
                stats.streak = 1;
            }
        } else {
            stats.streak = 1;
        }

        stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
    } else {
        stats.streak = 0;
    }

    stats.lastDate = today;
    saveStats(stats);
}

function revealHint(index) {
    if (index === 0) {
        // First quote
        const div = document.createElement('div');
        div.className = 'quote';
        div.textContent = `"${todayMovie.quotes[0]}"`;
        document.getElementById('quotes').appendChild(div);
        setTimeout(() => div.classList.add('show'), 50);
    } else if (index === 1) {
        // Second quote
        const div = document.createElement('div');
        div.className = 'quote';
        div.textContent = `"${todayMovie.quotes[1]}"`;
        document.getElementById('quotes').appendChild(div);
        setTimeout(() => div.classList.add('show'), 50);
    } else if (index === 2) {
        // First actor
        const div = document.createElement('div');
        div.className = 'actor';
        div.textContent = todayMovie.actors[0];
        document.getElementById('actors').appendChild(div);
        setTimeout(() => div.classList.add('show'), 50);
    } else if (index === 3) {
        // Second actor
        const div = document.createElement('div');
        div.className = 'actor';
        div.textContent = todayMovie.actors[1];
        document.getElementById('actors').appendChild(div);
        setTimeout(() => div.classList.add('show'), 50);
    } else if (index === 4) {
        // Year
        const yearTitle = document.getElementById('year-title');
        yearTitle.textContent = todayMovie.year;
        setTimeout(() => yearTitle.classList.add('show'), 50);
    } else if (index === 5) {
        // Title
        const yearTitle = document.getElementById('year-title');
        yearTitle.textContent = `${todayMovie.year} - ${todayMovie.title}`;
        yearTitle.classList.add('show');
    }
}

function handleGuess() {
    if (gameComplete) return;

    const input = document.getElementById('guess');
    const guess = input.value.trim().toLowerCase();

    if (!guess) return;

    if (guess === todayMovie.title.toLowerCase()) {
        revealHint(5);
        endGame(true, currentHint);
    } else {
        document.getElementById('message').textContent = 'nope';
        setTimeout(() => {
            document.getElementById('message').textContent = '';
        }, 2000);
        input.value = '';
    }
}

function handleNext() {
    if (gameComplete || currentHint >= 5) return;
    revealHint(currentHint);
    currentHint++;

    const state = loadState();
    state.hint = currentHint;
    saveState(state);

    if (currentHint >= 6) {
        endGame(false, currentHint - 1);
    }
}

function endGame(won, hints) {
    gameComplete = true;

    const state = loadState();
    state.complete = true;
    state.won = won;
    saveState(state);

    updateStats(won, hints);

    document.getElementById('guess').disabled = true;
    document.getElementById('next').disabled = true;

    if (won) {
        document.getElementById('message').textContent = 'correct';
    } else {
        document.getElementById('message').textContent = 'game over';
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    setTimeout(showStats, 1500);
}

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
        `next: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function showStats() {
    const stats = loadStats();

    document.getElementById('played').textContent = stats.played;
    document.getElementById('won').textContent = stats.won;
    document.getElementById('streak').textContent = stats.streak;

    const dist = document.getElementById('dist');
    dist.innerHTML = '';

    const max = Math.max(...stats.dist, 1);

    stats.dist.forEach((count, i) => {
        const bar = document.createElement('div');
        bar.className = 'bar';

        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = i + 1;

        const fill = document.createElement('div');
        fill.className = 'bar-fill';
        fill.style.width = `${Math.max((count / max) * 100, count > 0 ? 10 : 0)}%`;
        fill.textContent = count;

        bar.appendChild(label);
        bar.appendChild(fill);
        dist.appendChild(bar);
    });

    document.getElementById('modal').classList.add('show');
}

function shareResults() {
    const state = loadState();
    if (!state.complete) return;

    const hints = state.hint;
    let text = `Cinemdle ${getTodayKey()}\n`;
    text += state.won ? `${hints + 1}/6\n\n` : `X/6\n\n`;

    for (let i = 0; i < 6; i++) {
        if (i < hints) {
            text += '□';
        } else if (i === hints && state.won) {
            text += '■';
        } else {
            text += '·';
        }
    }

    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('share');
        const orig = btn.textContent;
        btn.textContent = 'copied';
        setTimeout(() => {
            btn.textContent = orig;
        }, 1500);
    });
}

function init() {
    todayMovie = getTodayMovie();
    const state = loadState();

    currentHint = state.hint;
    gameComplete = state.complete;

    for (let i = 0; i < currentHint; i++) {
        revealHint(i);
    }

    if (gameComplete) {
        document.getElementById('guess').disabled = true;
        document.getElementById('next').disabled = true;
        if (state.won) {
            document.getElementById('message').textContent = 'correct';
        } else {
            document.getElementById('message').textContent = 'game over';
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    document.getElementById('guess').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleGuess();
    });

    document.getElementById('next').addEventListener('click', handleNext);
    document.getElementById('stats').addEventListener('click', showStats);
    document.getElementById('share').addEventListener('click', shareResults);

    document.getElementById('close').addEventListener('click', () => {
        document.getElementById('modal').classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            document.getElementById('modal').classList.remove('show');
        }
    });
}

init();

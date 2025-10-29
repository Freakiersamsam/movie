const ROUNDS_PER_DAY = 5;

let currentHint = 0;
let currentRound = 0;
let gameComplete = false;
let todayMovie = null;

function getDevOffset() {
    const offset = localStorage.getItem('devOffset');
    return offset ? parseInt(offset) : 0;
}

function incrementDevOffset() {
    const current = getDevOffset();
    localStorage.setItem('devOffset', (current + 1).toString());
}

function getTodayMovies() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));

    // Add dev offset for testing different films
    // Multiply by 37 (prime number) to ensure very different selections
    const devOffset = getDevOffset();
    const seed = daysSinceEpoch + (devOffset * 37);

    const movies = [];

    // For each round, select a movie of appropriate difficulty
    for (let round = 0; round < ROUNDS_PER_DAY; round++) {
        const difficulty = round + 1; // Round 0=difficulty 1, Round 4=difficulty 5

        // Get all movies of this difficulty
        const moviesOfDifficulty = MOVIE_DATABASE.filter(m => m.difficulty === difficulty);

        // Select one based on the day + dev offset
        const index = (seed + round) % moviesOfDifficulty.length;
        movies.push(moviesOfDifficulty[index]);
    }

    return movies;
}

function getTodayMovie(round) {
    const movies = getTodayMovies();
    return movies[round];
}

// Build autocomplete list from all movie titles
function getAllMovieTitles() {
    return MOVIE_DATABASE.map(m => m.title).sort();
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
        rounds: Array(ROUNDS_PER_DAY).fill(null).map(() => ({
            hint: 0,
            complete: false,
            won: false
        })),
        currentRound: 0,
        allComplete: false
    };
}

function saveState(state) {
    localStorage.setItem('state', JSON.stringify(state));
}

function loadStats() {
    const saved = localStorage.getItem('stats');
    if (saved) return JSON.parse(saved);
    return {
        roundsPlayed: 0,
        roundsWon: 0,
        daysStreak: 0,
        maxDaysStreak: 0,
        dist: [0, 0, 0, 0, 0, 0],
        lastDate: null
    };
}

function saveStats(stats) {
    localStorage.setItem('stats', JSON.stringify(stats));
}

function updateStats(won, hints, allRoundsComplete) {
    const stats = loadStats();
    const today = getTodayKey();

    stats.roundsPlayed++;

    if (won) {
        stats.roundsWon++;
        // hints represents currentHint (next hint to show), so subtract 1 to get actual hints seen
        stats.dist[hints - 1]++;
    }

    // Only update day streak when all rounds are complete
    if (allRoundsComplete) {
        if (stats.lastDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;

            if (stats.lastDate === yesterdayKey) {
                stats.daysStreak++;
            } else {
                stats.daysStreak = 1;
            }
        } else {
            stats.daysStreak = 1;
        }

        stats.maxDaysStreak = Math.max(stats.maxDaysStreak, stats.daysStreak);
        stats.lastDate = today;
    }

    saveStats(stats);
}

function revealHint(index) {
    if (index === 0) {
        // First quote (first line)
        const div = document.createElement('div');
        div.className = 'quote';
        div.textContent = `"${todayMovie.quotes[0]}"`;
        document.getElementById('quotes').appendChild(div);
        setTimeout(() => div.classList.add('show'), 50);
    } else if (index === 1) {
        // Second quote (second line)
        const div = document.createElement('div');
        div.className = 'quote';
        div.textContent = `"${todayMovie.quotes[1]}"`;
        document.getElementById('quotes').appendChild(div);
        setTimeout(() => div.classList.add('show'), 50);
    } else if (index === 2) {
        // First actor - add inline to first quote
        const quotes = document.getElementById('quotes');
        const firstQuote = quotes.children[0];
        if (firstQuote) {
            const actor = document.createElement('div');
            actor.className = 'actor-inline';
            actor.textContent = `- ${todayMovie.actors[0]}`;
            firstQuote.appendChild(actor);
            setTimeout(() => actor.classList.add('show'), 50);
        }
    } else if (index === 3) {
        // Second actor - add inline to second quote
        const quotes = document.getElementById('quotes');
        const secondQuote = quotes.children[1];
        if (secondQuote) {
            const actor = document.createElement('div');
            actor.className = 'actor-inline';
            actor.textContent = `- ${todayMovie.actors[1]}`;
            secondQuote.appendChild(actor);
            setTimeout(() => actor.classList.add('show'), 50);
        }
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

    // Close autocomplete
    document.getElementById('autocomplete-list').innerHTML = '';

    const input = document.getElementById('guess');
    const guess = input.value.trim().toLowerCase();

    if (!guess) return;

    if (guess === todayMovie.title.toLowerCase()) {
        // Mark game as complete immediately to prevent other interactions
        gameComplete = true;
        input.disabled = true;
        document.getElementById('next').disabled = true;

        // Store the current hint count for stats
        const hintsUsed = currentHint;

        // Reveal all remaining hints in sequence
        let delay = 0;
        for (let i = currentHint; i <= 5; i++) {
            ((hintIndex) => {
                setTimeout(() => revealHint(hintIndex), delay);
            })(i);
            delay += 300;
        }

        // Call endRound after all hints are revealed
        setTimeout(() => endRound(true, hintsUsed), delay + 300);
    } else {
        document.getElementById('message').textContent = 'nope';
        setTimeout(() => {
            document.getElementById('message').textContent = '';
        }, 2000);
        input.value = '';
    }
}

function handleNext() {
    if (gameComplete) return;

    // Reveal current hint
    revealHint(currentHint);
    currentHint++;

    const state = loadState();
    state.rounds[currentRound].hint = currentHint;
    saveState(state);

    // After revealing the year (hint 4), next click reveals title and ends round
    if (currentHint > 5) {
        revealHint(5); // Reveal title
        setTimeout(() => {
            endRound(false, 5);
        }, 1000);
    }
}

function endRound(won, hints) {
    gameComplete = true;

    const state = loadState();
    state.rounds[currentRound].complete = true;
    state.rounds[currentRound].won = won;

    // Check if all rounds are complete
    const allComplete = state.rounds.every(r => r.complete);
    state.allComplete = allComplete;

    saveState(state);
    updateStats(won, hints, allComplete);

    document.getElementById('guess').disabled = true;
    document.getElementById('next').disabled = true;

    if (won) {
        document.getElementById('message').textContent = 'correct!';

        // Auto-advance to next round if available
        if (currentRound < ROUNDS_PER_DAY - 1 && !state.rounds[currentRound + 1].complete) {
            setTimeout(() => {
                startNextRound();
            }, 2000);
        } else {
            // All rounds complete
            if (allComplete) {
                updateCountdown();
                setInterval(updateCountdown, 1000);
            }
            setTimeout(showStats, 2000);
        }
    } else {
        document.getElementById('message').textContent = 'failed - the answer was ' + todayMovie.title;

        // Show button to go to next round or stats
        if (currentRound < ROUNDS_PER_DAY - 1 && !state.rounds[currentRound + 1].complete) {
            setTimeout(() => {
                const spacer = document.getElementById('button-spacer');
                spacer.innerHTML = '';

                const nextBtn = document.createElement('button');
                nextBtn.id = 'next-round-btn';
                nextBtn.textContent = 'next round';
                nextBtn.onclick = startNextRound;
                spacer.appendChild(nextBtn);
            }, 2000);
        } else {
            // All rounds complete
            if (allComplete) {
                updateCountdown();
                setInterval(updateCountdown, 1000);
            }
            setTimeout(showStats, 2000);
        }
    }
}

function startNextRound() {
    currentRound++;
    currentHint = 0;
    gameComplete = false;

    const state = loadState();
    state.currentRound = currentRound;
    saveState(state);

    // Clear the UI
    document.getElementById('quotes').innerHTML = '';
    document.getElementById('year-title').textContent = '';
    document.getElementById('year-title').classList.remove('show');
    document.getElementById('message').textContent = '';
    document.getElementById('guess').value = '';
    document.getElementById('guess').disabled = false;
    document.getElementById('next').disabled = false;

    // Clear the button spacer
    document.getElementById('button-spacer').innerHTML = '';

    // Load new movie
    todayMovie = getTodayMovie(currentRound);

    // Update round info
    updateRoundInfo();

    // Reveal first hint automatically
    revealHint(0);
    currentHint = 1;
    state.rounds[currentRound].hint = currentHint;
    saveState(state);
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

function updateRoundInfo() {
    const info = document.getElementById('round-info');
    const difficultyLabels = ['easy', 'medium', 'hard', 'harder', 'expert'];
    info.textContent = `round ${currentRound + 1}/${ROUNDS_PER_DAY} - ${difficultyLabels[currentRound]}`;
}

function showStats() {
    const stats = loadStats();

    document.getElementById('played').textContent = stats.roundsPlayed;
    document.getElementById('won').textContent = stats.roundsWon;
    document.getElementById('streak').textContent = stats.daysStreak;

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
    if (!state.allComplete) return;

    let text = `Cinemdle ${getTodayKey()}\n`;

    const wonRounds = state.rounds.filter(r => r.won).length;
    text += `${wonRounds}/${ROUNDS_PER_DAY} rounds\n\n`;

    state.rounds.forEach((round, idx) => {
        text += `${idx + 1}. `;
        if (round.won) {
            text += `${round.hint}/6`;
        } else {
            text += 'X/6';
        }
        text += '\n';
    });

    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('share');
        const orig = btn.textContent;
        btn.textContent = 'copied';
        setTimeout(() => {
            btn.textContent = orig;
        }, 1500);
    });
}

function setupAutocomplete() {
    const input = document.getElementById('guess');
    const autocompleteList = document.getElementById('autocomplete-list');
    const allTitles = getAllMovieTitles();
    let currentFocus = -1;

    input.addEventListener('input', function() {
        const val = this.value;
        closeAutocomplete();
        if (!val) return;

        currentFocus = -1;

        const matches = allTitles.filter(title =>
            title.toLowerCase().includes(val.toLowerCase())
        ).slice(0, 10); // Limit to 10 results

        matches.forEach(title => {
            const div = document.createElement('div');
            div.className = 'autocomplete-item';
            div.textContent = title;
            div.addEventListener('click', function() {
                input.value = title;
                closeAutocomplete();
            });
            autocompleteList.appendChild(div);
        });
    });

    input.addEventListener('keydown', function(e) {
        const items = autocompleteList.getElementsByClassName('autocomplete-item');
        if (e.keyCode === 40) { // Down arrow
            currentFocus++;
            addActive(items);
            e.preventDefault();
        } else if (e.keyCode === 38) { // Up arrow
            currentFocus--;
            addActive(items);
            e.preventDefault();
        } else if (e.keyCode === 13) { // Enter
            if (currentFocus > -1 && items[currentFocus]) {
                items[currentFocus].click();
                e.preventDefault();
            }
        }
    });

    function addActive(items) {
        if (!items) return false;
        removeActive(items);
        if (currentFocus >= items.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = items.length - 1;
        items[currentFocus].classList.add('autocomplete-active');
    }

    function removeActive(items) {
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('autocomplete-active');
        }
    }

    function closeAutocomplete() {
        autocompleteList.innerHTML = '';
    }

    document.addEventListener('click', function(e) {
        if (e.target !== input) {
            closeAutocomplete();
        }
    });
}

function init() {
    const state = loadState();

    setupAutocomplete();

    // Find the current round (first incomplete round or last round if all complete)
    currentRound = state.currentRound;
    if (state.rounds[currentRound].complete && currentRound < ROUNDS_PER_DAY - 1) {
        // Find next incomplete round
        for (let i = 0; i < ROUNDS_PER_DAY; i++) {
            if (!state.rounds[i].complete) {
                currentRound = i;
                state.currentRound = i;
                saveState(state);
                break;
            }
        }
    }

    todayMovie = getTodayMovie(currentRound);
    currentHint = state.rounds[currentRound].hint;
    gameComplete = state.rounds[currentRound].complete;

    // Update round info
    updateRoundInfo();

    // If starting fresh (no hints yet), show first hint automatically
    if (currentHint === 0 && !gameComplete) {
        revealHint(0);
        currentHint = 1;
        state.rounds[currentRound].hint = currentHint;
        saveState(state);
    } else {
        // Restore previous hints
        for (let i = 0; i < currentHint; i++) {
            revealHint(i);
        }
    }

    if (gameComplete) {
        document.getElementById('guess').disabled = true;
        document.getElementById('next').disabled = true;

        if (state.rounds[currentRound].won) {
            document.getElementById('message').textContent = 'correct!';

            // If won, auto-advance was already handled, but on page reload we show button
            if (currentRound < ROUNDS_PER_DAY - 1 && !state.rounds[currentRound + 1].complete) {
                const spacer = document.getElementById('button-spacer');
                if (!spacer.querySelector('#next-round-btn')) {
                    const nextBtn = document.createElement('button');
                    nextBtn.id = 'next-round-btn';
                    nextBtn.textContent = 'next round';
                    nextBtn.onclick = startNextRound;
                    spacer.appendChild(nextBtn);
                }
            }
        } else {
            document.getElementById('message').textContent = 'failed - the answer was ' + todayMovie.title;

            // If failed, show button to next round
            if (currentRound < ROUNDS_PER_DAY - 1 && !state.rounds[currentRound + 1].complete) {
                const spacer = document.getElementById('button-spacer');
                if (!spacer.querySelector('#next-round-btn')) {
                    const nextBtn = document.createElement('button');
                    nextBtn.id = 'next-round-btn';
                    nextBtn.textContent = 'next round';
                    nextBtn.onclick = startNextRound;
                    spacer.appendChild(nextBtn);
                }
            }
        }

        // Show countdown if all rounds complete
        if (state.allComplete) {
            updateCountdown();
            setInterval(updateCountdown, 1000);
        }
    }

    document.getElementById('guess').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleGuess();
    });

    document.getElementById('next').addEventListener('click', handleNext);
    document.getElementById('stats').addEventListener('click', showStats);
    document.getElementById('share').addEventListener('click', shareResults);
    document.getElementById('dev-reset').addEventListener('click', () => {
        if (confirm('Reset game with new films? (dev mode)')) {
            // Increment offset for new films
            incrementDevOffset();

            // Clear game state but keep dev offset
            localStorage.removeItem('state');
            localStorage.removeItem('stats');

            location.reload();
        }
    });

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

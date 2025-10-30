const ROUNDS_PER_DAY = 5;

// Timing constants
const TIMINGS = {
    HINT_REVEAL_DELAY: 50,
    HINT_CASCADE_DELAY: 80,
    END_ROUND_DELAY: 200,
    MESSAGE_DURATION: 2000,
    AUTO_ADVANCE_DELAY: 2000,
    AUTOCOMPLETE_DEBOUNCE: 150,
    COPIED_FEEDBACK_DURATION: 1500,
    SHIFT_KEY_TIMEOUT: 2000
};

// Game state
let currentHint = 0;
let currentRound = 0;
let gameComplete = false;
let todayMovie = null;

// Security: LocalStorage integrity protection
// Generates a device-specific fingerprint for data integrity
function getDeviceFingerprint() {
    const components = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        'cinemdle-v1' // Salt
    ];
    return components.join('|');
}

// Simple hash function for integrity checking
async function simpleHash(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Create integrity signature for data
async function createSignature(data) {
    const fingerprint = getDeviceFingerprint();
    const combined = JSON.stringify(data) + fingerprint;
    return await simpleHash(combined);
}

// Verify data integrity
async function verifySignature(data, signature) {
    const expectedSignature = await createSignature(data);
    return expectedSignature === signature;
}

// Secure save to localStorage with integrity check
async function secureSetItem(key, data) {
    try {
        const signature = await createSignature(data);
        const payload = {
            data: data,
            sig: signature,
            ts: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(payload));
        return true;
    } catch (e) {
        console.error('Failed to save secure data:', e);
        return false;
    }
}

// Secure load from localStorage with integrity verification
async function secureGetItem(key) {
    try {
        const stored = localStorage.getItem(key);
        if (!stored) return null;

        const payload = JSON.parse(stored);

        // Check if it's old format (no signature)
        if (!payload.sig || !payload.data) {
            // Migrate old data
            console.log('Migrating old data format for:', key);
            return JSON.parse(stored);
        }

        // Verify integrity
        const isValid = await verifySignature(payload.data, payload.sig);
        if (!isValid) {
            console.warn('Data integrity check failed for:', key);
            // Return null to force reset - prevents tampered data from being used
            return null;
        }

        return payload.data;
    } catch (e) {
        console.error('Failed to load secure data:', e);
        return null;
    }
}

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

// Helper function to display messages
function showMessage(text, duration = TIMINGS.MESSAGE_DURATION) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    if (duration) {
        setTimeout(() => {
            messageEl.textContent = '';
        }, duration);
    }
}

// Helper function to update hint counter
function updateHintCounter(hintNumber) {
    document.getElementById('hint-number').textContent = hintNumber;
}

async function loadState() {
    try {
        const state = await secureGetItem('state');
        if (state) {
            if (state.date === getTodayKey()) return state;
        }
    } catch (e) {
        console.error('Failed to load state:', e);
        showMessage('Unable to load saved game. Starting fresh.', TIMINGS.MESSAGE_DURATION);
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

async function saveState(state) {
    try {
        await secureSetItem('state', state);
    } catch (e) {
        console.error('Failed to save state:', e);
        showMessage('Unable to save game progress.', TIMINGS.MESSAGE_DURATION);
    }
}

async function loadStats() {
    try {
        const stats = await secureGetItem('stats');
        if (stats) return stats;
    } catch (e) {
        console.error('Failed to load stats:', e);
    }
    return {
        roundsPlayed: 0,
        roundsWon: 0,
        daysStreak: 0,
        maxDaysStreak: 0,
        dist: [0, 0, 0, 0, 0, 0],
        difficultyStats: {1: {played: 0, won: 0}, 2: {played: 0, won: 0}, 3: {played: 0, won: 0}, 4: {played: 0, won: 0}, 5: {played: 0, won: 0}},
        lastDate: null
    };
}

async function saveStats(stats) {
    try {
        await secureSetItem('stats', stats);
    } catch (e) {
        console.error('Failed to save stats:', e);
    }
}

async function updateStats(won, hints, allRoundsComplete) {
    const stats = await loadStats();
    const today = getTodayKey();

    stats.roundsPlayed++;

    // Track difficulty stats
    const difficulty = currentRound + 1;
    if (!stats.difficultyStats) {
        stats.difficultyStats = {1: {played: 0, won: 0}, 2: {played: 0, won: 0}, 3: {played: 0, won: 0}, 4: {played: 0, won: 0}, 5: {played: 0, won: 0}};
    }
    stats.difficultyStats[difficulty].played++;

    if (won) {
        stats.roundsWon++;
        stats.difficultyStats[difficulty].won++;
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

    await saveStats(stats);
}

function revealHint(index) {
    if (index === 0) {
        // First quote
        const div = document.createElement('div');
        div.className = 'quote fade-in';
        div.textContent = `"${todayMovie.quotes[0]}"`;
        document.getElementById('quotes').appendChild(div);
        setTimeout(() => div.classList.add('show'), TIMINGS.HINT_REVEAL_DELAY);
    } else if (index === 1) {
        // Second quote
        const div = document.createElement('div');
        div.className = 'quote fade-in';
        div.textContent = `"${todayMovie.quotes[1]}"`;
        document.getElementById('quotes').appendChild(div);
        setTimeout(() => div.classList.add('show'), TIMINGS.HINT_REVEAL_DELAY);
    } else if (index === 2) {
        // First actor - insert BEFORE first quote (screenplay format)
        const quotes = document.getElementById('quotes');
        const firstQuote = quotes.children[0];
        if (firstQuote) {
            const actor = document.createElement('div');
            actor.className = 'actor-inline fade-in';
            actor.textContent = todayMovie.actors[0];
            quotes.insertBefore(actor, firstQuote);
            setTimeout(() => actor.classList.add('show'), TIMINGS.HINT_REVEAL_DELAY);
        }
    } else if (index === 3) {
        // Second actor - find second quote and insert actor BEFORE it
        const quotes = document.getElementById('quotes');
        const allQuotes = quotes.querySelectorAll('.quote');
        const secondQuote = allQuotes[1];
        if (secondQuote) {
            const actor = document.createElement('div');
            actor.className = 'actor-inline fade-in';
            actor.textContent = todayMovie.actors[1];
            quotes.insertBefore(actor, secondQuote);
            setTimeout(() => actor.classList.add('show'), TIMINGS.HINT_REVEAL_DELAY);
        }
    } else if (index === 4) {
        // Year
        const yearTitle = document.getElementById('year-title');
        yearTitle.textContent = todayMovie.year;
        yearTitle.classList.add('fade-in');
        setTimeout(() => yearTitle.classList.add('show'), TIMINGS.HINT_REVEAL_DELAY);
    } else if (index === 5) {
        // Title
        const yearTitle = document.getElementById('year-title');
        yearTitle.textContent = `${todayMovie.year} - ${todayMovie.title}`;
        yearTitle.classList.add('show', 'fade-in');
    }

    // Update hint counter
    updateHintCounter(index + 1);

    // Show/hide give up button
    const giveUpBtn = document.getElementById('give-up');
    if (index >= 3 && !gameComplete) {
        giveUpBtn.style.display = 'inline-block';
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
        document.getElementById('give-up').style.display = 'none';

        // Add celebrate animation to container
        const container = document.querySelector('.container');
        container.classList.add('celebrate');
        setTimeout(() => container.classList.remove('celebrate'), 600);

        // Store the current hint count for stats
        const hintsUsed = currentHint;

        // Reveal all remaining hints in sequence - fast cascade
        let delay = 0;
        for (let i = currentHint; i <= 5; i++) {
            ((hintIndex) => {
                setTimeout(() => revealHint(hintIndex), delay);
            })(i);
            delay += TIMINGS.HINT_CASCADE_DELAY;
        }

        // Call endRound after all hints are revealed
        setTimeout(() => endRound(true, hintsUsed), delay + TIMINGS.END_ROUND_DELAY);
    } else {
        // Add shake animation to input
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);

        showMessage('nope', TIMINGS.MESSAGE_DURATION);
        input.value = '';

        // Auto-reveal next hint on wrong guess
        if (currentHint <= 5) {
            setTimeout(() => handleNext(), 500); // After shake animation
        }

        // Maintain focus on input
        input.focus();
    }
}

async function handleNext() {
    if (gameComplete) return;

    // Reveal current hint
    revealHint(currentHint);
    currentHint++;

    const state = await loadState();
    state.rounds[currentRound].hint = currentHint;
    await saveState(state);

    // After revealing the year (hint 4), next click reveals title and ends round
    if (currentHint > 5) {
        revealHint(5); // Reveal title
        setTimeout(() => {
            endRound(false, 5);
        }, 1000);
    }
}

async function endRound(won, hints) {
    gameComplete = true;

    const state = await loadState();
    state.rounds[currentRound].complete = true;
    state.rounds[currentRound].won = won;

    // Check if all rounds are complete
    const allComplete = state.rounds.every(r => r.complete);
    state.allComplete = allComplete;

    await saveState(state);
    await updateStats(won, hints, allComplete);

    document.getElementById('guess').disabled = true;
    document.getElementById('next').disabled = true;
    document.getElementById('give-up').style.display = 'none';

    if (won) {
        showMessage('correct!', null);

        // Auto-advance to next round if available
        if (currentRound < ROUNDS_PER_DAY - 1 && !state.rounds[currentRound + 1].complete) {
            setTimeout(() => {
                startNextRound();
            }, TIMINGS.AUTO_ADVANCE_DELAY);
        } else {
            // All rounds complete
            if (allComplete) {
                updateCountdown();
                setInterval(updateCountdown, 1000);
            }
            setTimeout(showStats, TIMINGS.AUTO_ADVANCE_DELAY);
        }
    } else {
        showMessage('failed - the answer was ' + todayMovie.title, null);

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
            }, TIMINGS.AUTO_ADVANCE_DELAY);
        } else {
            // All rounds complete
            if (allComplete) {
                updateCountdown();
                setInterval(updateCountdown, 1000);
            }
            setTimeout(showStats, TIMINGS.AUTO_ADVANCE_DELAY);
        }
    }
}

async function startNextRound() {
    currentRound++;
    currentHint = 0;
    gameComplete = false;

    const state = await loadState();
    state.currentRound = currentRound;
    await saveState(state);

    // Clear the UI
    document.getElementById('quotes').innerHTML = '';
    document.getElementById('year-title').textContent = '';
    document.getElementById('year-title').classList.remove('show', 'fade-in');
    document.getElementById('message').textContent = '';
    document.getElementById('guess').value = '';
    document.getElementById('guess').disabled = false;
    document.getElementById('next').disabled = false;
    document.getElementById('give-up').style.display = 'none';

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
    await saveState(state);

    // Focus on input
    document.getElementById('guess').focus();
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

async function showStats() {
    const stats = await loadStats();

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

    // Add difficulty stats
    if (stats.difficultyStats) {
        const difficultyStatsDiv = document.createElement('div');
        difficultyStatsDiv.className = 'difficulty-stats';

        const heading = document.createElement('h3');
        heading.textContent = 'win rate by difficulty';
        difficultyStatsDiv.appendChild(heading);

        const difficultyLabels = {1: 'easy', 2: 'medium', 3: 'hard', 4: 'harder', 5: 'expert'};

        for (let i = 1; i <= 5; i++) {
            const data = stats.difficultyStats[i];
            if (data && data.played > 0) {
                const winRate = Math.round((data.won / data.played) * 100);

                const row = document.createElement('div');
                row.className = 'difficulty-row';

                const labelSpan = document.createElement('span');
                labelSpan.className = 'label';
                labelSpan.textContent = difficultyLabels[i];

                const valueSpan = document.createElement('span');
                valueSpan.className = 'value';
                valueSpan.textContent = `${winRate}% (${data.won}/${data.played})`;

                row.appendChild(labelSpan);
                row.appendChild(valueSpan);
                difficultyStatsDiv.appendChild(row);
            }
        }

        dist.parentElement.appendChild(difficultyStatsDiv);
    }

    document.getElementById('modal').classList.add('show');
}

function shareResults() {
    const state = loadState();
    if (!state.allComplete) return;

    const wonRounds = state.rounds.filter(r => r.won).length;
    const difficultyEmojis = ['🟢', '🔵', '🟡', '🟠', '🔴'];

    let text = `Cinemdle ${getTodayKey()}\n`;
    text += `${wonRounds}/${ROUNDS_PER_DAY} rounds won\n\n`;

    state.rounds.forEach((round, idx) => {
        text += difficultyEmojis[idx] + ' ';
        if (round.won) {
            text += '✓ ' + `${round.hint}/6`;
        } else {
            text += '✗ X/6';
        }
        text += '\n';
    });

    text += '\nPlay at cinemdle.com';

    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('share');
        const orig = btn.textContent;
        btn.textContent = 'copied!';
        setTimeout(() => {
            btn.textContent = orig;
        }, TIMINGS.COPIED_FEEDBACK_DURATION);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showMessage('Failed to copy results', TIMINGS.MESSAGE_DURATION);
    });
}

function setupAutocomplete() {
    const input = document.getElementById('guess');
    const autocompleteList = document.getElementById('autocomplete-list');
    const allTitles = getAllMovieTitles();
    let currentFocus = -1;
    let debounceTimer;

    input.addEventListener('input', function() {
        const val = this.value;

        // Debounce the search
        clearTimeout(debounceTimer);

        if (!val) {
            closeAutocomplete();
            return;
        }

        debounceTimer = setTimeout(() => {
            closeAutocomplete();
            currentFocus = -1;

            // Simple fuzzy matching: check if all characters appear in order
            const matches = allTitles.filter(title => {
                const titleLower = title.toLowerCase();
                const valLower = val.toLowerCase();

                // First try exact substring match
                if (titleLower.includes(valLower)) return true;

                // Then try fuzzy match
                let titleIndex = 0;
                for (let char of valLower) {
                    titleIndex = titleLower.indexOf(char, titleIndex);
                    if (titleIndex === -1) return false;
                    titleIndex++;
                }
                return true;
            }).slice(0, 10); // Limit to 10 results

            matches.forEach(title => {
                const div = document.createElement('div');
                div.className = 'autocomplete-item';
                div.setAttribute('role', 'option');

                // Highlight matching text - using safe DOM manipulation instead of innerHTML
                const valLower = val.toLowerCase();
                const titleLower = title.toLowerCase();
                const startIndex = titleLower.indexOf(valLower);

                if (startIndex !== -1) {
                    // Exact match - highlight it using DOM methods (prevents XSS)
                    const before = title.substring(0, startIndex);
                    const match = title.substring(startIndex, startIndex + val.length);
                    const after = title.substring(startIndex + val.length);

                    if (before) div.appendChild(document.createTextNode(before));

                    const strong = document.createElement('strong');
                    strong.textContent = match;
                    div.appendChild(strong);

                    if (after) div.appendChild(document.createTextNode(after));
                } else {
                    div.textContent = title;
                }

                div.addEventListener('click', function() {
                    input.value = title;
                    closeAutocomplete();
                });
                autocompleteList.appendChild(div);
            });
        }, TIMINGS.AUTOCOMPLETE_DEBOUNCE);
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

async function init() {
    const state = await loadState();

    setupAutocomplete();

    // Find the current round (first incomplete round or last round if all complete)
    currentRound = state.currentRound;
    if (state.rounds[currentRound].complete && currentRound < ROUNDS_PER_DAY - 1) {
        // Find next incomplete round
        for (let i = 0; i < ROUNDS_PER_DAY; i++) {
            if (!state.rounds[i].complete) {
                currentRound = i;
                state.currentRound = i;
                await saveState(state);
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
        await saveState(state);
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

    // Give up button handler
    document.getElementById('give-up').addEventListener('click', () => {
        if (!gameComplete && confirm('Give up and reveal the answer?')) {
            // Reveal all remaining hints
            let delay = 0;
            for (let i = currentHint; i <= 5; i++) {
                ((hintIndex) => {
                    setTimeout(() => revealHint(hintIndex), delay);
                })(i);
                delay += TIMINGS.HINT_CASCADE_DELAY;
            }

            // Call endRound as failed
            setTimeout(() => endRound(false, 5), delay + TIMINGS.END_ROUND_DELAY);
        }
    });

    // Help modal handlers
    document.getElementById('help').addEventListener('click', () => {
        document.getElementById('help-modal').classList.add('show');
    });

    document.getElementById('close-help').addEventListener('click', () => {
        document.getElementById('help-modal').classList.remove('show');
    });

    // Dev reset handler
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

    // Modal close handlers
    document.getElementById('close').addEventListener('click', () => {
        document.getElementById('modal').classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            document.getElementById('modal').classList.remove('show');
        }
        if (e.target.id === 'help-modal') {
            document.getElementById('help-modal').classList.remove('show');
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+H - reveal next hint
        if (e.ctrlKey && e.key === 'h') {
            e.preventDefault();
            if (!gameComplete) handleNext();
        }

        // Ctrl+S - show stats
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            showStats();
        }

        // ? - show help
        if (e.key === '?' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            document.getElementById('help-modal').classList.add('show');
        }
    });
}

init();

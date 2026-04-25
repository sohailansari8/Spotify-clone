// ============================================
// SPORTIFY CLONE — Main Script
// ============================================

let songs = [];
let currentsong = new Audio();
let currfolder = '';
let currentIndex = -1;

// --- Utility: Format seconds to MM:SS ---
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// --- Fetch songs for a folder via API ---
async function getsongs(folder) {
    currfolder = folder;

    try {
        const response = await fetch(`/api/songs/${encodeURIComponent(folder)}`);
        if (!response.ok) throw new Error('Failed to load songs');
        songs = await response.json();
    } catch (err) {
        console.error('Error loading songs:', err);
        songs = [];
        return;
    }

    // Populate song list in sidebar
    const songUL = document.getElementById('songList');
    songUL.innerHTML = '';

    if (songs.length === 0) {
        songUL.innerHTML = '<li style="color:#b3b3b3; justify-content:center; cursor:default;">No songs in this playlist</li>';
        return;
    }

    for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        const li = document.createElement('li');
        li.dataset.index = i;
        li.innerHTML = `
            <img class="invert" src="/images/music.svg" alt="">
            <div class="info">
                <div class="song-name">${decodeURIComponent(song.replaceAll("%20", " "))}</div>
                <div class="song-info">Unknown Artist</div>
            </div>
            <div class="play-Now">
                <span>Play Now</span>
                <img class="invert" src="/images/play.svg" alt="">
            </div>
        `;
        li.addEventListener('click', () => {
            playMusic(song, false, i);
        });
        songUL.appendChild(li);
    }
}

// --- Play a song ---
const playMusic = (track, pause = false, index = -1) => {
    if (!track) return;

    currentsong.src = `/songs/${encodeURIComponent(currfolder)}/${encodeURIComponent(track)}`;
    currentIndex = index >= 0 ? index : songs.indexOf(track);

    if (!pause) {
        currentsong.play();
        document.getElementById('play').src = '/images/pause.svg';
    }

    document.getElementById('songInfo').innerHTML = decodeURIComponent(track.replaceAll('%20', ' '));
    document.getElementById('songTime').innerHTML = '00:00 / 00:00';

    // Highlight active song in sidebar
    highlightActiveSong();
};

// --- Highlight the currently playing song ---
function highlightActiveSong() {
    const allSongs = document.querySelectorAll('#songList li');
    allSongs.forEach(li => {
        if (parseInt(li.dataset.index) === currentIndex) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    });
}

// --- Display album cards via API ---
async function displayAlbums() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const cardContainer = document.getElementById('cardContainer');

    try {
        const response = await fetch('/api/albums');
        if (!response.ok) throw new Error('Failed to load albums');
        const albums = await response.json();

        // Hide loading indicator
        if (loadingIndicator) loadingIndicator.classList.add('hidden');

        for (const album of albums) {
            const card = document.createElement('div');
            card.dataset.folder = album.folder;
            card.className = 'card';
            card.innerHTML = `
                <img src="/songs/${encodeURIComponent(album.folder)}/cover.jpg" alt="${album.title || album.folder} cover art">
                <h2>${album.title || album.folder}</h2>
                <p>${album.description || ''}</p>
                <div class="play-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="black"
                        viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="12" fill="#1db954" />
                        <polygon points="9,7 17,12 9,17" fill="black" />
                    </svg>
                </div>
            `;
            card.addEventListener('click', async () => {
                await getsongs(album.folder);
                if (songs.length > 0) {
                    playMusic(songs[0], false, 0);
                }
            });
            cardContainer.appendChild(card);
        }
    } catch (err) {
        console.error('Error loading albums:', err);
        if (loadingIndicator) {
            loadingIndicator.innerHTML = '<p>Failed to load playlists. Please refresh.</p>';
        }
    }
}

// --- Main initialization ---
async function main() {
    // Load default folder
    await getsongs('ncs');

    if (songs.length > 0) {
        playMusic(songs[0], true, 0); // Load first song but don't auto-play
    }

    // Display album cards
    displayAlbums();

    // --- Play / Pause ---
    const playBtn = document.getElementById('play');
    playBtn.addEventListener('click', () => {
        if (currentsong.paused) {
            currentsong.play();
            playBtn.src = '/images/pause.svg';
        } else {
            currentsong.pause();
            playBtn.src = '/images/play.svg';
        }
    });

    // --- Time update: seekbar + time display ---
    currentsong.addEventListener('timeupdate', () => {
        document.getElementById('songTime').innerHTML =
            `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`;

        const percent = (currentsong.currentTime / currentsong.duration) * 100;
        if (!isNaN(percent)) {
            document.getElementById('seekCircle').style.left = percent + '%';
        }
    });

    // --- Auto-play next song when current ends ---
    currentsong.addEventListener('ended', () => {
        if (currentIndex + 1 < songs.length) {
            playMusic(songs[currentIndex + 1], false, currentIndex + 1);
        } else {
            // Playlist ended, reset to beginning
            playBtn.src = '/images/play.svg';
        }
    });

    // --- Seekbar click ---
    document.getElementById('seekbar').addEventListener('click', (e) => {
        const percent = e.offsetX / e.target.getBoundingClientRect().width;
        document.getElementById('seekCircle').style.left = (percent * 100) + '%';
        currentsong.currentTime = currentsong.duration * percent;
    });

    // --- Hamburger menu (mobile) ---
    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').classList.add('active');
    });

    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.left').classList.remove('active');
    });

    // --- Previous song ---
    document.getElementById('previous').addEventListener('click', () => {
        if (currentIndex - 1 >= 0) {
            playMusic(songs[currentIndex - 1], false, currentIndex - 1);
        }
    });

    // --- Next song (fixed off-by-one) ---
    document.getElementById('next').addEventListener('click', () => {
        if (currentIndex + 1 < songs.length) {
            playMusic(songs[currentIndex + 1], false, currentIndex + 1);
        }
    });

    // --- Volume icon toggle (only on the icon, not the slider) ---
    document.getElementById('volumeIcon').addEventListener('click', (e) => {
        e.stopPropagation();
        const rangeEl = document.getElementById('volumeRange');
        rangeEl.classList.toggle('visible');
    });

    // --- Prevent volume slider clicks from toggling the range ---
    document.getElementById('volumeRange').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // --- Volume slider change ---
    document.getElementById('volumeSlider').addEventListener('input', (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
    });

    // --- Close volume slider when clicking outside ---
    document.addEventListener('click', (e) => {
        const volumeControl = document.getElementById('volumeControl');
        const rangeEl = document.getElementById('volumeRange');
        if (!volumeControl.contains(e.target)) {
            rangeEl.classList.remove('visible');
        }
    });

    // --- Keyboard shortcuts ---
    document.addEventListener('keydown', (e) => {
        // Space to play/pause (only when not in an input)
        if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            playBtn.click();
        }
        // Arrow left: previous
        if (e.code === 'ArrowLeft' && e.target.tagName !== 'INPUT') {
            document.getElementById('previous').click();
        }
        // Arrow right: next
        if (e.code === 'ArrowRight' && e.target.tagName !== 'INPUT') {
            document.getElementById('next').click();
        }
    });
}

main();
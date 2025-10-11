// script.js
document.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.getElementById('auth-container');
    const playerContainer = document.getElementById('player-container');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const audioPlayer = document.getElementById('audio-player');
    const mp3Upload = document.getElementById('mp3-upload');
    const youtubeUrl = document.getElementById('youtube-url');
    const playButton = document.getElementById('play-button');
    const metadataDiv = document.getElementById('metadata');
    const shareButton = document.getElementById('share-button');
    const signoutButton = document.getElementById('signout-button');

    signoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        authContainer.style.display = 'block';
        playerContainer.style.display = 'none';
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (res.ok) {
                alert('Registration successful!');
            } else {
                const data = await res.json();
                alert(data.msg || 'Registration failed');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred');
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (res.ok) {
                const { token } = await res.json();
                localStorage.setItem('token', token);
                authContainer.style.display = 'none';
                playerContainer.style.display = 'block';
            } else {
                const data = await res.json();
                alert(data.msg || 'Login failed');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred');
        }
    });

    // Load the IFrame Player API code asynchronously.
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('youtube-player', {
            height: '360',
            width: '640',
            events: {
                'onReady': onPlayerReady,
            }
        });
    }

    function onPlayerReady(event) {
        // Player is ready
    }

    function getYouTubeVideoId(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return null;
        }
    }

    mp3Upload.addEventListener('change', () => {
        const file = mp3Upload.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            audioPlayer.src = fileURL;

            window.jsmediatags.read(file, {
                onSuccess: function(tag) {
                    const { title, artist, album } = tag.tags;
                    metadataDiv.innerHTML = `
                        <p><strong>Title:</strong> ${title || 'Unknown'}</p>
                        <p><strong>Artist:</strong> ${artist || 'Unknown'}</p>
                        <p><strong>Album:</strong> ${album || 'Unknown'}</p>
                    `;
                },
                onError: function(error) {
                    console.error('Error reading metadata:', error);
                    metadataDiv.innerHTML = '<p>Could not read metadata.</p>';
                }
            });
        }
    });

    playButton.addEventListener('click', () => {
        if (audioPlayer.src && !youtubeUrl.value.trim()) {
            audioPlayer.play();
        } else if (youtubeUrl.value.trim() !== '') {
            const videoId = getYouTubeVideoId(youtubeUrl.value);
            if (videoId) {
                player.loadVideoById(videoId);
            } else {
                alert('Invalid YouTube URL');
            }
        }
    });

    shareButton.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('App link copied to clipboard!');
        });
    });
});
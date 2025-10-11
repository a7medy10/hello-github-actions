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
    const recordButton = document.getElementById('record-button');

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

    recordButton.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks);
                const formData = new FormData();
                formData.append('audio', audioBlob);
                const token = localStorage.getItem('token');
                try {
                    const res = await fetch('/api/acrcloud/recognize', {
                        method: 'POST',
                        headers: {
                            'x-auth-token': token
                        },
                        body: formData
                    });
                    const data = await res.json();
                    const resultDiv = document.getElementById('recognition-result');
                    if (data.status.msg === 'Success' && data.metadata.music.length > 0) {
                        const music = data.metadata.music[0];
                        resultDiv.innerHTML = `
                            <h3>Recognition Result:</h3>
                            <p><strong>Title:</strong> ${music.title}</p>
                            <p><strong>Artist:</strong> ${music.artists.map(a => a.name).join(', ')}</p>
                            <p><strong>Album:</strong> ${music.album.name}</p>
                        `;
                    } else {
                        resultDiv.innerHTML = `<p>No result found.</p>`;
                    }
                } catch (err) {
                    console.error(err);
                    alert('An error occurred during recognition.');
                }
            };
            mediaRecorder.start();
            setTimeout(() => {
                mediaRecorder.stop();
            }, 5000); // Record for 5 seconds
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Could not access microphone. Please grant permission.');
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
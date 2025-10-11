const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Playlist = require('../models/Playlist');
const User = require('../models/User');

// Create a playlist
router.post('/', auth, async (req, res) => {
    const { name } = req.body;
    try {
        const newPlaylist = new Playlist({
            name,
            user: req.user.id
        });
        const playlist = await newPlaylist.save();
        res.json(playlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get user's playlists
router.get('/', auth, async (req, res) => {
    try {
        const playlists = await Playlist.find({ user: req.user.id });
        res.json(playlists);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get a specific playlist
router.get('/:id', auth, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ msg: 'Playlist not found' });
        }
        if (playlist.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        res.json(playlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add a track to a playlist
router.post('/:id/tracks', auth, async (req, res) => {
    const { title, artist, album, type, url } = req.body;
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ msg: 'Playlist not found' });
        }
        if (playlist.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        const newTrack = {
            title,
            artist,
            album,
            type,
            url
        };
        playlist.tracks.push(newTrack);
        await playlist.save();
        res.json(playlist.tracks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
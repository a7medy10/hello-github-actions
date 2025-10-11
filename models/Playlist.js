const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    tracks: [
        {
            title: String,
            artist: String,
            album: String,
            type: {
                type: String,
                enum: ['mp3', 'youtube'],
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
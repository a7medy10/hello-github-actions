const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const Chat = require('./models/Chat');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

mongoose.connect('mongodb://localhost/media-player')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/acrcloud', require('./routes/acrcloud'));
app.use('/api/chat', require('./routes/chat'));

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('sendMessage', async (data) => {
        try {
            const { sender, recipient, message } = data;
            const chatMessage = new Chat({ sender, recipient, message });
            await chatMessage.save();
            io.to(recipient).emit('receiveMessage', chatMessage);
        } catch (err) {
            console.error(err);
        }
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

const express = require('express');
const cookieParser = require('cookie-parser');
const env = require('dotenv');
const pool = require('./database');
const pagesRoutes = require('./routes/pages');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

env.config({ path: './env' });

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*', // Adjust for production with specific origins
        methods: ['GET', 'POST']
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse URL encoded bodies as sent by HTML forms
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Define Routes
app.use('/', pagesRoutes);
app.use('/auth', require('./routes/auth'));

app.get('/', (req, res) => {
    res.render('ui/index');
});
app.set('view cache', false);

// Placeholder for dedicated signaling server route
app.get('/signaling', (req, res) => {
    res.send('Signaling server endpoint - use dedicated server in production');
});

// Start the application server
const APP_PORT = process.env.APP_PORT || 3000;
server.listen(APP_PORT, () => {
    const now = new Date();
    console.log(`Application server running on port ${APP_PORT} at ${now.toLocaleString('en-US', { timeZone: 'Africa/Lagos' })}`);
});

// Separate signaling server (to be moved to a dedicated process in production)
const signalingServer = http.createServer();
const signalingIo = socketIo(signalingServer, {
    cors: {
        origin: '*', // Adjust for production
        methods: ['GET', 'POST']
    }
});

signalingIo.on('connection', (socket) => {
    console.log('Signaling server: User connected:', socket.id);

    socket.on('join-room', (roomId, userId, role) => {
        socket.join(roomId);
        socket.data.role = role;
        const room = signalingIo.sockets.adapter.rooms.get(roomId);
        if (room && room.size === 2 && ![...room].some(s => s.data.role === role)) {
            socket.to(roomId).emit('user-joined', userId);
            socket.emit('room-joined', socket.id);
        } else if (room && room.size >= 2) {
            socket.emit('room-full');
        } else {
            socket.to(roomId).emit('user-joined', userId);
            socket.emit('room-joined', socket.id);
        }
    });

    socket.on('offer', (roomId, offer) => {
        socket.to(roomId).emit('offer', offer);
    });

    socket.on('answer', (roomId, answer) => {
        socket.to(roomId).emit('answer', answer);
    });

    socket.on('ice-candidate', (roomId, candidate) => {
        socket.to(roomId).emit('ice-candidate', candidate);
    });

    socket.on('leave-room', (roomId) => {
        socket.leave(roomId);
        socket.to(roomId).emit('user-left', socket.id);
    });

    socket.on('disconnect', () => {
        console.log('Signaling server: User disconnected:', socket.id);
        const rooms = Object.keys(socket.rooms);
        rooms.forEach(roomId => {
            if (roomId !== socket.id) socket.to(roomId).emit('user-left', socket.id);
        });
    });
});

// Start the signaling server on a different port (for development)
const SIGNALING_PORT = process.env.SIGNALING_PORT || 3001;
signalingServer.listen(SIGNALING_PORT, () => {
    const now = new Date();
    console.log(`Signaling server running on port ${SIGNALING_PORT} at ${now.toLocaleString('en-US', { timeZone: 'Africa/Lagos' })}`);
});

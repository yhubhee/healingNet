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

// Application server setup (port 3000)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use('/', pagesRoutes);
app.use('/auth', require('./routes/auth'));

app.get('/', (req, res) => {
    res.render('ui/index');
});
app.set('view cache', false);

const APP_PORT = process.env.APP_PORT || 3000;
server.listen(APP_PORT, () => {
    const now = new Date();
    console.log(`Application server running on port ${APP_PORT} at ${now.toLocaleString('en-US', { timeZone: 'Africa/Lagos' })}`);
});

// Separate signaling server (port 3001)
const signalingServer = http.createServer();
const signalingIo = socketIo(signalingServer, {
    cors: {
        origin: 'http://localhost:3000', // Adjust for production
        methods: ['GET', 'POST']
    }
});

signalingIo.on('connection', (socket) => {
    console.log('Signaling server: User connected:', socket.id);

    socket.on('join-room', (appointmentId, userId) => {
        // Query the database to verify the user
        pool.query(
            'SELECT doctor_id, patient_id FROM appointment WHERE appointment_id = ?',
            [appointmentId],
            console.log('Querying appointment:', appointmentId),
            (err, results) => {
                if (err || results.length === 0) {
                    socket.emit('error', 'Appointment not found.');
                    return;
                }

                const appointment = results[0];
                const allowedIds = [appointment.doctor_id, appointment.patient_id];

                // Check if userId matches doctor_id or patient_id
                if (!allowedIds.includes(userId)) {
                    socket.emit('error', 'You’re not authorized for this appointment.');
                    return;
                }

                // Join the room (roomId = appointmentId)
                socket.join(appointmentId);

                // Check room size
                const room = signalingIo.sockets.adapter.rooms.get(appointmentId);
                if (room && room.size > 2) {
                    socket.emit('room-full');
                } else {
                    socket.to(appointmentId).emit('user-joined', userId);
                    socket.emit('room-joined', socket.id);
                }
            }
        );
    });

    socket.on('offer', (appointmentId, offer) => {
        socket.to(appointmentId).emit('offer', offer);
    });

    socket.on('answer', (appointmentId, answer) => {
        socket.to(appointmentId).emit('answer', answer);
    });

    socket.on('ice-candidate', (appointmentId, candidate) => {
        socket.to(appointmentId).emit('ice-candidate', candidate);
    });

    socket.on('leave-room', (appointmentId) => {
        socket.leave(appointmentId);
        socket.to(appointmentId).emit('user-left', socket.id);
    });

    socket.on('disconnect', () => {
        console.log('Signaling server: User disconnected:', socket.id);
        const rooms = Object.keys(socket.rooms);
        rooms.forEach(roomId => {
            if (roomId !== socket.id) socket.to(roomId).emit('user-left', socket.id);
        });
    });
});

const SIGNALING_PORT = process.env.SIGNALING_PORT || 3001;
signalingServer.listen(SIGNALING_PORT, () => {
    const now = new Date();
    console.log(`Signaling server running on port ${SIGNALING_PORT} at ${now.toLocaleString('en-US', { timeZone: 'Africa/Lagos' })}`);
});
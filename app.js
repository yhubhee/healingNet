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
  cors: { origin: '*' }
});

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

// Socket.IO handling
const userConnections = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('userconnect', (data) => {
    const { appointment_id, user_display_id, user_name } = data;
    console.log(`User ${user_name} with id ${user_display_id} attempting to join room ${appointment_id}`);
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Database error:', err);
        socket.emit('error', 'Database connection failed');
        return;
      }
      connection.promise().query(
        'SELECT patient_id, doctor_id FROM appointment WHERE appointment_id = ? AND status = ? AND (patient_id = ? OR doctor_id = ?)',
        [appointment_id, 'scheduled', user_display_id, user_display_id]
      )
        .then(([results]) => {
          connection.release();
          if (results.length === 0) {
            console.error('Appointment not found');
            socket.emit('error', 'Appointment not found');
            return;
          }

          // Join the socket.io room using appointment_id
          socket.join(appointment_id);

          userConnections.push({
            connection_id: socket.id,
            appointment_id,
            user_display_id,
            user_name
          });
          // Participant
          var userCount = userConnections.length;
          console.log(userCount)

          // Get all sockets in the room except the current one
          io.in(appointment_id).allSockets().then(socketsInRoom => {
            const otherSockets = Array.from(socketsInRoom).filter(id => id !== socket.id);

            // Inform others in the room about the new user
            socket.to(appointment_id).emit("inform_others", {
              other_users: {
                user_display_id: user_display_id,
                user_name: user_name
              },
              connId: socket.id
            });

            // Inform the new user about all others in the room
            const other_users = otherSockets.map(id => ({
              connection_id: id,
              user_name: userConnections.find(u => u.connection_id === id)?.user_name || 'Unknown',
              user_display_id: userConnections.find(u => u.connection_id === id)?.user_display_id || 'Unknown'
            }));
            console.log("other_users sent to new user:", other_users);
            socket.emit("inform_me_about_others", other_users);
          });
        }).catch(err => {
          connection.release();
          console.error('Query error:', err);
          socket.emit('error', 'Failed to join room');
        });
    });
  });

  socket.on("SDPProcess", (data) => {
    // Forward SDP messages directly to the target socket id
    socket.to(data.to_connid).emit("SDPProcess", {
      message: data.message,
      from_connid: socket.id
    });
  });

  socket.on("sendMessage", (msg) => {
    console.log(msg);
    var mUser = userConnections.find((p) => p.connection_id == socket.id);
    if (mUser) {
      var appointment_id = mUser.appointment_id;
      var from = mUser.user_name;
      var list = userConnections.filter((p) => p.appointment_id == appointment_id);
      list.forEach((v) => {
        socket.to(v.connection_id).emit("showChatMessage", {
          from: from,
          message: msg
        })

      })
    }
  });

  // Optionally handle disconnects and clean up if you store user info elsewhere
  socket.on("disconnect", function () {
    console.log("Disconnected");
    var disuser = userConnections.find((p) => p.connection_id == socket.id);
    if (disuser) {
      var appointment_id = disuser.appointment_id;
      userConnections.filter((p) => p.connection_id != socket.id);
      var list = userConnections.filter((p) => p.appointment_id == appointment_id)
      list.forEach((v) => {
        var userNumberAffDisconnect = userConnections.length;
        socket.to(v.connection_id).emit("inform_about_disconnections", {
          connId: socket.id,
          uNumber: userNumberAffDisconnect
        });
      });
      console.log("User disconnected:", socket.id, "from appointment:", appointment_id);
    }
  });
});

const APP_PORT = process.env.APP_PORT || 3000;
server.listen(APP_PORT, () => {
  const now = new Date();
  console.log(`Application server running on port ${APP_PORT} at ${now.toLocaleString('en-US', { timeZone: 'Africa/Lagos' })}`);
});
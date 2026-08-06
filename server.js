const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.static(path.join(__dirname, '.')));

// Room management
const rooms = new Map();

// Generate 6-digit room code
function generateRoomCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Create or join room
    socket.on('join-room', ({ roomId, username, side }) => {
        const room = rooms.get(roomId) || { 
            users: [], 
            motion: null, 
            tossResult: null,
            preparationStartTime: null 
        };

        // Check if room is full (max 2 users)
        if (room.users.length >= 2) {
            socket.emit('room-full');
            return;
        }

        // Add user to room
        const user = {
            id: socket.id,
            username,
            side,
            joinedAt: Date.now()
        };
        room.users.push(user);
        rooms.set(roomId, room);

        socket.join(roomId);
        console.log(`User ${username} joined room ${roomId} as ${side}`);

        // Send join success confirmation
        socket.emit('join-success', { roomId });

        // Notify room about new user
        socket.to(roomId).emit('user-joined', { user });

        // If both users are in room, notify everyone
        if (room.users.length === 2) {
            io.to(roomId).emit('room-ready', { users: room.users });
        }

        // Send current room state to new user
        socket.emit('room-state', { 
            users: room.users,
            motion: room.motion,
            tossResult: room.tossResult,
            preparationStartTime: room.preparationStartTime
        });
    });

    // WebRTC signaling
    socket.on('offer', ({ roomId, offer }) => {
        socket.to(roomId).emit('offer', { offer, senderId: socket.id });
    });

    socket.on('answer', ({ roomId, answer }) => {
        socket.to(roomId).emit('answer', { answer, senderId: socket.id });
    });

    socket.on('ice-candidate', ({ roomId, candidate }) => {
        socket.to(roomId).emit('ice-candidate', { candidate, senderId: socket.id });
    });

    // Sync motion between clients
    socket.on('sync-motion', ({ roomId, motion }) => {
        const room = rooms.get(roomId);
        if (room) {
            room.motion = motion;
            rooms.set(roomId, room);
            // Broadcast to all users in room (including sender for confirmation)
            io.to(roomId).emit('motion-synced', { motion });
        }
    });

    // Sync toss result
    socket.on('sync-toss', ({ roomId, tossResult }) => {
        const room = rooms.get(roomId);
        if (room) {
            room.tossResult = tossResult;
            rooms.set(roomId, room);
            // Broadcast to all users in room (including sender for confirmation)
            io.to(roomId).emit('toss-synced', { tossResult });
        }
    });

    // Sync preparation timer start
    socket.on('sync-preparation-start', ({ roomId, startTime }) => {
        const room = rooms.get(roomId);
        if (room) {
            room.preparationStartTime = startTime;
            rooms.set(roomId, room);
            // Broadcast to all users in room (including sender for confirmation)
            io.to(roomId).emit('preparation-start-synced', { startTime });
        }
    });

    // Leave room
    socket.on('leave-room', ({ roomId }) => {
        const room = rooms.get(roomId);
        if (room) {
            room.users = room.users.filter(u => u.id !== socket.id);
            if (room.users.length === 0) {
                rooms.delete(roomId);
            } else {
                rooms.set(roomId, room);
                socket.to(roomId).emit('user-left', { userId: socket.id });
            }
        }
        socket.leave(roomId);
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Remove user from all rooms
        for (const [roomId, room] of rooms.entries()) {
            const userIndex = room.users.findIndex(u => u.id === socket.id);
            if (userIndex !== -1) {
                room.users.splice(userIndex, 1);
                if (room.users.length === 0) {
                    rooms.delete(roomId);
                } else {
                    rooms.set(roomId, room);
                    io.to(roomId).emit('user-left', { userId: socket.id });
                }
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

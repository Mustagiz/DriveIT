import { Server } from 'socket.io';
import { createServer } from 'http';

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production'
        ? ['https://driveit.in', 'https://www.driveit.in']
        : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on('sendMessage', async (data) => {
      const { recipientId, message, senderId, senderName, senderRole } = data;
      socket.to(recipientId).emit('newMessage', {
        senderId,
        senderName,
        senderRole,
        message,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('rideUpdate', (data) => {
      io.to(data.rideId).emit('rideUpdated', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

import { Server } from 'socket.io';

// Track connected pilots and their GPS positions
const pilotRooms = new Map(); // rideId -> { pilotSocketId, lastPosition }
const passengerRooms = new Map(); // rideId -> Set<socketId>

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production'
        ? ['https://driveit.in', 'https://www.driveit.in']
        : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 30000,
    pingInterval: 10000
  });

  io.on('connection', (socket) => {
    console.log(`[WS] Client connected: ${socket.id}`);

    // ─── User Auth Room ─────────────────────────────────────────────────────
    socket.on('join', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`[WS] User ${userId} joined personal room`);
    });

    // ─── Ride Tracking — Pilot Side ─────────────────────────────────────────
    socket.on('pilot:joinRide', ({ rideId, pilotId }) => {
      socket.join(`ride:${rideId}`);
      socket.join(`pilot:${rideId}`);
      pilotRooms.set(rideId, { pilotSocketId: socket.id, pilotId, lastPosition: null });
      console.log(`[WS] Pilot ${pilotId} joined ride room: ${rideId}`);

      // Notify passengers that pilot is live
      socket.to(`ride:${rideId}`).emit('pilot:online', { rideId, pilotId, timestamp: Date.now() });
    });

    // Pilot broadcasts real GPS position from device
    socket.on('pilot:location', ({ rideId, lat, lng, speed, bearing, battery, eta }) => {
      const position = { lat, lng, speed, bearing, battery, eta, timestamp: Date.now() };

      // Update stored position
      if (pilotRooms.has(rideId)) {
        pilotRooms.get(rideId).lastPosition = position;
      }

      // Broadcast to all passengers tracking this ride
      socket.to(`ride:${rideId}`).emit('gps:update', {
        rideId,
        ...position
      });
    });

    // ─── Ride Tracking — Passenger Side ─────────────────────────────────────
    socket.on('passenger:trackRide', ({ rideId, passengerId }) => {
      socket.join(`ride:${rideId}`);

      if (!passengerRooms.has(rideId)) passengerRooms.set(rideId, new Set());
      passengerRooms.get(rideId).add(socket.id);

      console.log(`[WS] Passenger ${passengerId} tracking ride: ${rideId}`);

      // Send last known position immediately if pilot already broadcasting
      const pilotData = pilotRooms.get(rideId);
      if (pilotData?.lastPosition) {
        socket.emit('gps:update', { rideId, ...pilotData.lastPosition });
      } else {
        socket.emit('pilot:offline', { rideId });
      }
    });

    socket.on('passenger:stopTracking', ({ rideId }) => {
      socket.leave(`ride:${rideId}`);
      if (passengerRooms.has(rideId)) {
        passengerRooms.get(rideId).delete(socket.id);
      }
    });

    // ─── Booking Notifications ───────────────────────────────────────────────
    socket.on('booking:new', ({ rideId, passengerId, passengerName, seatsBooked, bookingRef }) => {
      // Notify pilot of new booking
      io.to(`pilot:${rideId}`).emit('booking:incoming', {
        rideId,
        passengerId,
        passengerName,
        seatsBooked,
        bookingRef,
        timestamp: Date.now()
      });
    });

    socket.on('booking:confirmed', ({ passengerId, rideId, bookingRef }) => {
      // Notify passenger their booking was confirmed
      io.to(`user:${passengerId}`).emit('booking:confirmed', {
        rideId,
        bookingRef,
        timestamp: Date.now()
      });
    });

    socket.on('booking:cancelled', ({ userId, rideId, reason }) => {
      io.to(`user:${userId}`).emit('booking:cancelled', { rideId, reason, timestamp: Date.now() });
    });

    // ─── SOS Emergency Broadcast ─────────────────────────────────────────────
    socket.on('sos:trigger', ({ rideId, pilotId, passengerIds, location, plateNumber }) => {
      const sosPayload = {
        rideId,
        pilotId,
        plateNumber,
        location,
        timestamp: Date.now(),
        severity: 'CRITICAL'
      };

      // Notify all passengers on this ride
      if (passengerIds && Array.isArray(passengerIds)) {
        passengerIds.forEach(pid => {
          io.to(`user:${pid}`).emit('sos:alert', sosPayload);
        });
      }

      // Broadcast to admin room
      io.to('admin:room').emit('sos:alert', sosPayload);

      // Acknowledge to sender
      socket.emit('sos:acknowledged', { rideId, timestamp: Date.now() });
      console.log(`[SOS] Emergency triggered on ride ${rideId} at ${JSON.stringify(location)}`);
    });

    // ─── Admin Rooms ─────────────────────────────────────────────────────────
    socket.on('admin:join', (adminId) => {
      socket.join('admin:room');
      console.log(`[WS] Admin ${adminId} joined admin room`);
    });

    // ─── Ride Status Updates ─────────────────────────────────────────────────
    socket.on('ride:statusUpdate', ({ rideId, status, broadcastTo }) => {
      io.to(`ride:${rideId}`).emit('ride:updated', { rideId, status, timestamp: Date.now() });
    });

    // ─── Chat Messages ────────────────────────────────────────────────────────
    socket.on('sendMessage', ({ recipientId, message, senderId, senderName, senderRole, threadId }) => {
      io.to(`user:${recipientId}`).emit('newMessage', {
        senderId,
        senderName,
        senderRole,
        message,
        threadId,
        timestamp: new Date().toISOString()
      });
    });

    // ─── Departure Reminder ──────────────────────────────────────────────────
    socket.on('ride:departure:reminder', ({ rideId, passengerIds, departureTime }) => {
      if (Array.isArray(passengerIds)) {
        passengerIds.forEach(pid => {
          io.to(`user:${pid}`).emit('push:departureReminder', {
            rideId,
            departureTime,
            message: 'Your ride departs in 30 minutes!'
          });
        });
      }
    });

    // ─── Disconnect Cleanup ──────────────────────────────────────────────────
    socket.on('disconnect', () => {
      // Clean up pilot rooms
      for (const [rideId, data] of pilotRooms.entries()) {
        if (data.pilotSocketId === socket.id) {
          pilotRooms.delete(rideId);
          io.to(`ride:${rideId}`).emit('pilot:offline', { rideId });
          console.log(`[WS] Pilot disconnected from ride ${rideId}`);
        }
      }

      // Clean up passenger rooms
      for (const [rideId, sockets] of passengerRooms.entries()) {
        sockets.delete(socket.id);
      }

      console.log(`[WS] Client disconnected: ${socket.id}`);
    });
  });

  // ─── Server-side ride departure reminder scheduler ──────────────────────
  // Check every minute for rides departing in ~30 mins and notify
  setInterval(() => {
    const now = new Date();
    // This would query the DB in production; placeholder here
    io.to('admin:room').emit('heartbeat', { timestamp: now.toISOString() });
  }, 60000);

  return io;
}

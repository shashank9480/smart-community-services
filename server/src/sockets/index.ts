import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

let io: Server | null = null;

export function initSockets(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Socket authentication middleware
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const secret = process.env.JWT_SECRET || 'super-secret-smart-community-services-jwt-key-2026';
      const decoded = jwt.verify(token, secret) as any;
      (socket as any).user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    console.log(`🔌 Socket connected: User ${user?.email} [Role: ${user?.role}] (${socket.id})`);

    // Join room based on user role (e.g. "GUARDS" for SOS alerts, "ADMIN" for admin alerts)
    if (user?.role === 'GUARD') {
      socket.join('room:guards');
      console.log(`👤 User ${user.email} joined room:guards`);
    } else if (user?.role === 'ADMIN') {
      socket.join('room:admin');
    }

    // Join specific flat room if resident
    if (user?.flat_id) {
      socket.join(`flat:${user.flat_id}`);
      console.log(`🏠 User joined room: flat:${user.flat_id}`);
    }

    // Join specific user room for direct pings
    if (user?.id) {
      socket.join(`user:${user.id}`);
    }

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: User ${user?.email} (${socket.id})`);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
}

// Utility broadcasting helpers for upcoming modules
export function pushToGuards(event: string, data: any) {
  if (io) {
    io.to('room:guards').emit(event, data);
  }
}

export function pushToFlat(flatId: string, event: string, data: any) {
  if (io) {
    io.to(`flat:${flatId}`).emit(event, data);
  }
}

export function pushToUser(userId: string, event: string, data: any) {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
}

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import http from 'http';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
  },
});

// Database connection logic optimized for serverless environments
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        if (!process.env.MONGO_URI) {
            console.log('MONGO_URI not found in .env, starting server without DB');
            return null;
        }

        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
            console.log('MongoDB Connected successfully');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.warn('⚠️ MongoDB connection failed, but proceeding since we are using Firebase:', e.message);
        return null; // Return null instead of throwing
    }

    return cached.conn;
};

import morgan from 'morgan';
import logger from './utils/logger.js';
import authRoutes from './routes/authRoutes.js';

// Middlewares
app.use(express.json());
app.use(cors());

// Custom Morgan logger for API req/res details
app.use(morgan((tokens, req, res) => {
    const status = tokens.status(req, res);
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const time = tokens['response-time'](req, res);
    
    logger.api(method, url, status, time);
    return null; // Return null to avoid printing the default morgan line
}));

// Health Check Route
app.get('/', (req, res) => {
  res.send('StyleNext Backend is running');
});

// Admin Auth Routes
app.use('/api/admin', authRoutes);

// Error Handling Middleware (Detailed and color-coded)
app.use((err, req, res, next) => {
    logger.error(`${req.method} ${req.url} - ${err.message}`);
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack); // Stack log for development
    }
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Socket logic can be extended here
io.on('connection', (socket) => {
    logger.success(`User connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

export { app, server, io, connectDB };

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const colors = require('colors');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Initialize express
const app = express();

// Connect to database (skip if in test environment)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middleware
app.use(helmet()); // Security headers

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://fe-fintrix.vercel.app', 'https://fe-fintrix.netlify.app'] // Ganti dengan URL frontend production
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Terlalu banyak request dari IP ini, coba lagi setelah 15 menit'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`.cyan);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Fintrix API',
    version: '1.0.0',
    documentation: {
      health: 'GET /health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        profile: 'GET /api/auth/me',
        updateProfile: 'PUT /api/auth/profile',
        changePassword: 'PUT /api/auth/change-password'
      },
      transactions: {
        list: 'GET /api/transactions',
        detail: 'GET /api/transactions/:id',
        create: 'POST /api/transactions',
        update: 'PUT /api/transactions/:id',
        delete: 'DELETE /api/transactions/:id',
        summary: 'GET /api/transactions/summary'
      }
    },
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack?.red || err.stack);
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} sudah digunakan`,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
      errors: messages,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID tidak valid',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token sudah kadaluarsa'
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server (hanya jika bukan environment test)
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  
  // Handle EADDRINUSE error (port already in use)
  const server = app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50).green);
    console.log(`🚀 Server running on port ${PORT}`.yellow.bold);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`.cyan);
    console.log(`🔗 API URL: http://localhost:${PORT}`.green);
    console.log(`🔗 Health Check: http://localhost:${PORT}/health`.green);
    console.log('='.repeat(50).green + '\n');
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use. Please close other applications or change PORT in .env`.red);
      process.exit(1);
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });

  // Graceful shutdown
  const gracefulShutdown = () => {
    console.log('\n📥 Received shutdown signal. Closing server...'.yellow);
    
    server.close(() => {
      console.log('✅ Server closed'.green);
      
      // Close database connection
      mongoose.connection.close(false, () => {
        console.log('✅ Database connection closed'.green);
        process.exit(0);
      });
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.error('❌ Could not close connections in time, forcefully shutting down'.red);
      process.exit(1);
    }, 10000);
  };

  // Handle shutdown signals
  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('❌ UNCAUGHT EXCEPTION!'.red.bold);
    console.error(err.stack?.red || err);
    gracefulShutdown();
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('❌ UNHANDLED REJECTION!'.red.bold);
    console.error(err.stack?.red || err);
    gracefulShutdown();
  });
}

// Export app untuk testing
module.exports = app;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  
  // Cek header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Ambil token dari header
      token = req.headers.authorization.split(' ')[1];
      
      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Ambil data user dari database (tanpa password)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }
      
      // Cek apakah user masih aktif
      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Akun Anda telah dinonaktifkan'
        });
      }
      
      next();
    } catch (error) {
      console.error(error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Token tidak valid'
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token sudah kadaluarsa'
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Tidak diizinkan, token gagal'
      });
    }
  }
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Tidak diizinkan, tidak ada token'
    });
  }
};

// Middleware untuk role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} tidak diizinkan mengakses resource ini`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };

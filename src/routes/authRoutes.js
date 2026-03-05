const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');

// Validasi rules
const registerValidation = [
  body('fullName')
    .notEmpty().withMessage('Nama lengkap wajib diisi')
    .isLength({ min: 3 }).withMessage('Nama lengkap minimal 3 karakter')
    .isLength({ max: 50 }).withMessage('Nama lengkap maksimal 50 karakter'),
  body('email')
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password wajib diisi')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
];

const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password wajib diisi')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Password saat ini wajib diisi'),
  body('newPassword')
    .notEmpty().withMessage('Password baru wajib diisi')
    .isLength({ min: 6 }).withMessage('Password baru minimal 6 karakter')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', protect, logout);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePasswordValidation, changePassword);

module.exports = router;
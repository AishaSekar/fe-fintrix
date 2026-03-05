const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary
} = require('../controllers/transactionController');

// Validasi rules
const transactionValidation = [
  body('type')
    .notEmpty().withMessage('Tipe transaksi wajib diisi')
    .isIn(['income', 'expense']).withMessage('Tipe harus income atau expense'),
  body('category')
    .notEmpty().withMessage('Kategori wajib diisi')
    .isIn([
      'Makanan & Minuman',
      'Transportasi',
      'Belanja',
      'Hiburan',
      'Tagihan',
      'Kesehatan',
      'Pendidikan',
      'Gaji',
      'Investasi',
      'Lainnya'
    ]).withMessage('Kategori tidak valid'),
  body('amount')
    .notEmpty().withMessage('Jumlah wajib diisi')
    .isNumeric().withMessage('Jumlah harus angka')
    .custom(value => value >= 0).withMessage('Jumlah tidak boleh negatif'),
  body('date')
    .optional()
    .isISO8601().withMessage('Format tanggal tidak valid'),
  body('description')
    .optional()
    .isLength({ max: 200 }).withMessage('Deskripsi maksimal 200 karakter')
];

// All routes are protected
router.use(protect);

// Summary route (harus di atas route :id)
router.get('/summary', getSummary);

// CRUD routes
router.route('/')
  .get(getTransactions)
  .post(transactionValidation, createTransaction);

router.route('/:id')
  .get(getTransaction)
  .put(transactionValidation, updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
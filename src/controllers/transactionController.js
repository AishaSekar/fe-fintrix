const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      category, 
      startDate, 
      endDate,
      sort = '-date' 
    } = req.query;

    // Build query
    const query = { user: req.user.id };
    
    if (type) query.type = type;
    if (category) query.category = category;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Execute query with pagination
    const transactions = await Transaction.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get total count
    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaksi tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });

  } catch (error) {
    console.error(error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Transaksi tidak ditemukan'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Tambahkan user ID ke body
    req.body.user = req.user.id;

    const transaction = await Transaction.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Transaksi berhasil ditambahkan',
      data: transaction
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaksi tidak ditemukan'
      });
    }

    // Update transaction
    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Transaksi berhasil diupdate',
      data: transaction
    });

  } catch (error) {
    console.error(error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Transaksi tidak ditemukan'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaksi tidak ditemukan'
      });
    }

    await transaction.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Transaksi berhasil dihapus'
    });

  } catch (error) {
    console.error(error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Transaksi tidak ditemukan'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get transaction summary
// @route   GET /api/transactions/summary
// @access  Private
const getSummary = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate, endDate;
    const now = new Date();
    
    // Tentukan periode
    switch(period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        endDate = new Date();
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // Aggregate pipeline
    const summary = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $facet: {
          totalByType: [
            {
              $group: {
                _id: '$type',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
              }
            }
          ],
          byCategory: [
            {
              $group: {
                _id: { type: '$type', category: '$category' },
                total: { $sum: '$amount' },
                count: { $sum: 1 }
              }
            },
            { $sort: { total: -1 } }
          ],
          dailyTotal: [
            {
              $group: {
                _id: { 
                  $dateToString: { format: '%Y-%m-%d', date: '$date' }
                },
                income: {
                  $sum: {
                    $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
                  }
                },
                expense: {
                  $sum: {
                    $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
                  }
                }
              }
            },
            { $sort: { '_id': 1 } }
          ]
        }
      }
    ]);

    // Hitung balance
    const totalIncome = summary[0].totalByType.find(t => t._id === 'income')?.total || 0;
    const totalExpense = summary[0].totalByType.find(t => t._id === 'expense')?.total || 0;
    const balance = totalIncome - totalExpense;

    res.status(200).json({
      success: true,
      data: {
        period,
        startDate,
        endDate,
        summary: {
          totalIncome,
          totalExpense,
          balance,
          totalTransactions: summary[0].totalByType.reduce((acc, curr) => acc + curr.count, 0),
          byCategory: summary[0].byCategory,
          dailyTotal: summary[0].dailyTotal
        }
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary
};
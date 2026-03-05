const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID wajib diisi']
  },
  type: {
    type: String,
    required: [true, 'Tipe transaksi wajib diisi'],
    enum: {
      values: ['income', 'expense'],
      message: '{VALUE} tidak valid. Pilih income atau expense'
    }
  },
  category: {
    type: String,
    required: [true, 'Kategori wajib diisi'],
    enum: {
      values: [
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
      ],
      message: '{VALUE} tidak valid'
    }
  },
  amount: {
    type: Number,
    required: [true, 'Jumlah wajib diisi'],
    min: [0, 'Jumlah tidak boleh negatif']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Deskripsi maksimal 200 karakter']
  },
  date: {
    type: Date,
    required: [true, 'Tanggal transaksi wajib diisi'],
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: {
      values: ['Cash', 'Bank Transfer', 'Credit Card', 'Debit Card', 'E-Wallet'],
      message: '{VALUE} tidak valid'
    },
    default: 'Cash'
  },
  attachments: [{
    type: String // URL ke file attachment
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringInterval: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: function() {
      return this.isRecurring;
    }
  }
}, {
  timestamps: true
});

// Index untuk performa query
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });
transactionSchema.index({ user: 1, type: 1 });

// Virtual untuk format amount
transactionSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(this.amount);
});

// Method untuk mendapatkan ringkasan
transactionSchema.statics.getSummary = async function(userId, startDate, endDate) {
  const summary = await this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  return summary;
};

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
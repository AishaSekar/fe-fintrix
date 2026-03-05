const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Nama lengkap wajib diisi'],
    trim: true,
    minlength: [3, 'Nama lengkap minimal 3 karakter'],
    maxlength: [50, 'Nama lengkap maksimal 50 karakter']
  },
  email: {
    type: String,
    required: [true, 'Email wajib diisi'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Format email tidak valid'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password wajib diisi'],
    minlength: [6, 'Password minimal 6 karakter'],
    select: false // Tidak ikut diquery kecuali diminta
  },
  profilePicture: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  monthlyBudget: {
    type: Number,
    default: 0,
    min: [0, 'Budget tidak boleh negatif']
  },
  currency: {
    type: String,
    default: 'IDR',
    enum: {
      values: ['IDR', 'USD', 'EUR'],
      message: '{VALUE} tidak didukung'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true // Otomatis buat createdAt dan updatedAt
});

// Encrypt password sebelum disimpan
userSchema.pre('save', async function(next) {
  // Hanya hash password jika dimodifikasi
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method untuk membandingkan password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method untuk membuat response user (tanpa password)
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpire;
  delete user.__v;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    
    // Event listener untuk koneksi
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`.red);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected'.yellow);
    });
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
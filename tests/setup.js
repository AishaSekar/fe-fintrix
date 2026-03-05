const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let mongoServer;

// Koneksi ke database in-memory sebelum semua test
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Bersihkan database setelah setiap test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// Putuskan koneksi setelah semua test
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
const request = require('supertest');
const app = require('../src/index');
const User = require('../src/models/User');
const Transaction = require('../src/models/Transaction');

describe('Transaction API Tests', () => {
  let token;
  let userId;

  const testUser = {
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  const testTransaction = {
    type: 'expense',
    category: 'Makanan & Minuman',
    amount: 150000,
    description: 'Makan siang',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash'
  };

  beforeEach(async () => {
    // Register user dan dapatkan token
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    token = registerRes.body.data.token;
    userId = registerRes.body.data.user._id;
  });

  describe('POST /api/transactions', () => {
    it('should create transaction successfully', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send(testTransaction);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.type).toBe(testTransaction.type);
      expect(res.body.data.category).toBe(testTransaction.category);
      expect(res.body.data.amount).toBe(testTransaction.amount);
      expect(res.body.data.user).toBe(userId);
    });

    it('should not create transaction without required fields', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should not create transaction with negative amount', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...testTransaction,
          amount: -1000
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should not create transaction without token', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .send(testTransaction);

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/transactions', () => {
    beforeEach(async () => {
      // Buat beberapa transaksi
      await Transaction.create({
        user: userId,
        ...testTransaction
      });
      await Transaction.create({
        user: userId,
        ...testTransaction,
        type: 'income',
        category: 'Gaji',
        amount: 5000000
      });
    });

    it('should get all transactions', async () => {
      const res = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination).toBeDefined();
    });

    it('should filter transactions by type', async () => {
      const res = await request(app)
        .get('/api/transactions?type=expense')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].type).toBe('expense');
    });

    it('should filter transactions by category', async () => {
      const res = await request(app)
        .get('/api/transactions?category=Gaji')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].category).toBe('Gaji');
    });

    it('should paginate results', async () => {
      const res = await request(app)
        .get('/api/transactions?page=1&limit=1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(1);
      expect(res.body.pagination.total).toBe(2);
    });
  });

  describe('GET /api/transactions/summary', () => {
    beforeEach(async () => {
      // Buat transaksi untuk summary
      await Transaction.create({
        user: userId,
        type: 'income',
        category: 'Gaji',
        amount: 10000000,
        date: new Date()
      });
      await Transaction.create({
        user: userId,
        type: 'expense',
        category: 'Makanan & Minuman',
        amount: 2000000,
        date: new Date()
      });
      await Transaction.create({
        user: userId,
        type: 'expense',
        category: 'Transportasi',
        amount: 1000000,
        date: new Date()
      });
    });

    it('should get monthly summary', async () => {
      const res = await request(app)
        .get('/api/transactions/summary?period=month')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.summary.totalIncome).toBe(10000000);
      expect(res.body.data.summary.totalExpense).toBe(3000000);
      expect(res.body.data.summary.balance).toBe(7000000);
      expect(res.body.data.summary.byCategory).toHaveLength(3);
    });

    it('should get weekly summary', async () => {
      const res = await request(app)
        .get('/api/transactions/summary?period=week')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.period).toBe('week');
    });
  });

  describe('GET /api/transactions/:id', () => {
    let transactionId;

    beforeEach(async () => {
      const transaction = await Transaction.create({
        user: userId,
        ...testTransaction
      });
      transactionId = transaction._id;
    });

    it('should get single transaction by id', async () => {
      const res = await request(app)
        .get(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(transactionId.toString());
    });

    it('should return 404 for non-existent transaction', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .get(`/api/transactions/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/transactions/:id', () => {
    let transactionId;

    beforeEach(async () => {
      const transaction = await Transaction.create({
        user: userId,
        ...testTransaction
      });
      transactionId = transaction._id;
    });

    it('should update transaction successfully', async () => {
      const updates = {
        amount: 200000,
        description: 'Makan malam'
      };

      const res = await request(app)
        .put(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.amount).toBe(updates.amount);
      expect(res.body.data.description).toBe(updates.description);
    });
  });

  describe('DELETE /api/transactions/:id', () => {
    let transactionId;

    beforeEach(async () => {
      const transaction = await Transaction.create({
        user: userId,
        ...testTransaction
      });
      transactionId = transaction._id;
    });

    it('should delete transaction successfully', async () => {
      const res = await request(app)
        .delete(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Transaksi berhasil dihapus');

      // Cek apakah benar-benar terhapus
      const deleted = await Transaction.findById(transactionId);
      expect(deleted).toBeNull();
    });
  });
});
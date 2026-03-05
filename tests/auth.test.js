const request = require('supertest');
const app = require('../src/index');
const User = require('../src/models/User');

describe('Authentication API Tests', () => {
  // Data test
  const testUser = {
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  describe('POST /api/auth/register', () => {
    it('should register new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Registrasi berhasil');
      expect(res.body.data.user).toHaveProperty('_id');
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.user.fullName).toBe(testUser.fullName);
      expect(res.body.data.user.password).toBeUndefined();
      expect(res.body.data).toHaveProperty('token');
    });

    it('should not register with existing email', async () => {
      // Buat user dulu
      await User.create(testUser);

      // Coba register dengan email yang sama
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Email sudah terdaftar');
    });

    it('should not register with invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          email: 'invalid-email'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should not register with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          password: '123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should not register without required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Buat user sebelum test login
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Login berhasil');
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should not login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Email atau password salah');
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Email atau password salah');
    });

    it('should not login without email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          password: testUser.password
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let token;

    beforeEach(async () => {
      // Register dan login untuk dapat token
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      token = registerRes.body.data.token;
    });

    it('should get current user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUser.email);
      expect(res.body.data.fullName).toBe(testUser.fullName);
    });

    it('should not get profile without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should not get profile with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/auth/profile', () => {
    let token;

    beforeEach(async () => {
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      token = registerRes.body.data.token;
    });

    it('should update profile successfully', async () => {
      const updates = {
        fullName: 'Updated Name',
        monthlyBudget: 5000000,
        currency: 'USD'
      };

      const res = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updates);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.fullName).toBe(updates.fullName);
      expect(res.body.data.monthlyBudget).toBe(updates.monthlyBudget);
      expect(res.body.data.currency).toBe(updates.currency);
    });
  });

  describe('PUT /api/auth/change-password', () => {
    let token;

    beforeEach(async () => {
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      token = registerRes.body.data.token;
    });

    it('should change password successfully', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: testUser.password,
          newPassword: 'newpassword123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Password berhasil diubah');

      // Coba login dengan password baru
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'newpassword123'
        });

      expect(loginRes.statusCode).toBe(200);
    });

    it('should not change password with wrong current password', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Password saat ini salah');
    });
  });
});
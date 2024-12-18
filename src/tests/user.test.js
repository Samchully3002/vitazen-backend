// /tests/user.test.js

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const redisCache = require('../utils/redisCache');
const userController = require('../controllers/userControllers');
const User = require('../models/user');

const app = express();
app.use(express.json());
app.post('/user', userController.createUser);
app.get('/users', userController.getUser);
app.get('/user/:accountNumber', userController.getUserByAccountNumber);

// Mocking MongoDB and Redis
jest.mock('mongoose', () => ({
  model: jest.fn(),
  find: jest.fn(),
  save: jest.fn()
}));

jest.mock('../utils/redisCache', () => ({
  getCache: jest.fn(),
  setCache: jest.fn()
}));

describe('User Controller Tests', () => {
  
  describe('POST /user', () => {
    it('should create a user successfully', async () => {
      const mockUser = { name: 'John', age: 30 };
      User.prototype.save = jest.fn().mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/user')
        .send(mockUser);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockUser);
    });

    it('should return 400 if user creation fails', async () => {
      User.prototype.save = jest.fn().mockRejectedValue(new Error('Creation failed'));

      const res = await request(app)
        .post('/user')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Creation failed');
    });
  });

  describe('GET /users', () => {
    it('should retrieve all users', async () => {
      const mockUsers = [{ name: 'John', age: 30 }, { name: 'Doe', age: 25 }];
      User.find = jest.fn().mockResolvedValue(mockUsers);

      const res = await request(app).get('/users');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUsers);
    });

    it('should return 500 if server error occurs', async () => {
      User.find = jest.fn().mockRejectedValue(new Error('Server error'));

      const res = await request(app).get('/users');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message', 'Server error');
    });
  });

  describe('GET /user/:accountNumber', () => {
    it('should retrieve user from cache if exists', async () => {
      const mockUser = { accountNumber: '12345', name: 'John' };
      redisCache.getCache.mockResolvedValue(mockUser);

      const res = await request(app).get('/user/12345');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
    });

    it('should fetch user from DB and cache it if not in cache', async () => {
      const mockUser = { accountNumber: '12345', name: 'John' };
      redisCache.getCache.mockResolvedValue(null);  // Simulate cache miss
      User.findOne = jest.fn().mockResolvedValue(mockUser);
      redisCache.setCache = jest.fn();

      const res = await request(app).get('/user/12345');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
      expect(redisCache.setCache).toHaveBeenCalledWith('acc:12345', mockUser);
    });

    it('should return 500 if an error occurs', async () => {
      redisCache.getCache.mockRejectedValue(new Error('Redis error'));

      const res = await request(app).get('/user/12345');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message', 'Redis error');
    });
  });
});

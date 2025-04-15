import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { clientRoutes } from '../clientRoutes';
import { ClientModel } from '../../models/Client';
import { authMiddleware } from '../../middleware/auth';

// Mock dependencies
jest.mock('../../models/Client');
jest.mock('../../middleware/auth');
jest.mock('jsonwebtoken');
jest.mock('../../config', () => ({
  jwtSecret: 'test-secret'
}));

describe('Client API Routes', () => {
  let app: express.Application;
  let mongoServer: MongoMemoryServer;
  
  beforeAll(async () => {
    // Setup in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    
    // Setup Express app
    app = express();
    app.use(express.json());
    app.use('/api/clients', clientRoutes);
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock auth middleware to simulate authenticated requests
    (authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
      req.user = {
        userId: 'user_id',
        role: 'Admin'
      };
      next();
    });
  });
  
  describe('GET /api/clients', () => {
    it('should return all clients', async () => {
      // Arrange
      const mockClients = [
        {
          _id: 'client1',
          name: 'Client 1',
          businessUnit: 'Digital',
          contactPerson: 'John Doe',
          email: 'john@client1.com',
          phone: '1234567890'
        },
        {
          _id: 'client2',
          name: 'Client 2',
          businessUnit: 'Creative',
          contactPerson: 'Jane Smith',
          email: 'jane@client2.com',
          phone: '0987654321'
        }
      ];
      
      (ClientModel.find as jest.Mock).mockResolvedValue(mockClients);
      
      // Act
      const response = await request(app).get('/api/clients');
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockClients);
      expect(ClientModel.find).toHaveBeenCalled();
    });
    
    it('should handle errors', async () => {
      // Arrange
      (ClientModel.find as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // Act
      const response = await request(app).get('/api/clients');
      
      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Server error' });
    });
  });
  
  describe('GET /api/clients/:id', () => {
    it('should return a client by ID', async () => {
      // Arrange
      const mockClient = {
        _id: 'client1',
        name: 'Client 1',
        businessUnit: 'Digital',
        contactPerson: 'John Doe',
        email: 'john@client1.com',
        phone: '1234567890'
      };
      
      (ClientModel.findById as jest.Mock).mockResolvedValue(mockClient);
      
      // Act
      const response = await request(app).get('/api/clients/client1');
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockClient);
      expect(ClientModel.findById).toHaveBeenCalledWith('client1');
    });
    
    it('should return 404 if client not found', async () => {
      // Arrange
      (ClientModel.findById as jest.Mock).mockResolvedValue(null);
      
      // Act
      const response = await request(app).get('/api/clients/nonexistent');
      
      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Client not found' });
    });
  });
  
  describe('POST /api/clients', () => {
    it('should create a new client', async () => {
      // Arrange
      const newClient = {
        name: 'New Client',
        businessUnit: 'Digital',
        contactPerson: 'New Person',
        email: 'new@client.com',
        phone: '1122334455'
      };
      
      const savedClient = {
        _id: 'new-client-id',
        ...newClient
      };
      
      (ClientModel.create as jest.Mock).mockResolvedValue(savedClient);
      
      // Act
      const response = await request(app)
        .post('/api/clients')
        .send(newClient);
      
      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual(savedClient);
      expect(ClientModel.create).toHaveBeenCalledWith(newClient);
    });
    
    it('should validate required fields', async () => {
      // Arrange
      const invalidClient = {
        // Missing required fields
        businessUnit: 'Digital'
      };
      
      // Act
      const response = await request(app)
        .post('/api/clients')
        .send(invalidClient);
      
      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(ClientModel.create).not.toHaveBeenCalled();
    });
  });
  
  describe('PUT /api/clients/:id', () => {
    it('should update an existing client', async () => {
      // Arrange
      const clientId = 'client1';
      const updateData = {
        name: 'Updated Client',
        contactPerson: 'Updated Person'
      };
      
      const updatedClient = {
        _id: clientId,
        name: 'Updated Client',
        businessUnit: 'Digital',
        contactPerson: 'Updated Person',
        email: 'john@client1.com',
        phone: '1234567890'
      };
      
      (ClientModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedClient);
      
      // Act
      const response = await request(app)
        .put(`/api/clients/${clientId}`)
        .send(updateData);
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedClient);
      expect(ClientModel.findByIdAndUpdate).toHaveBeenCalledWith(
        clientId,
        updateData,
        { new: true }
      );
    });
    
    it('should return 404 if client not found', async () => {
      // Arrange
      (ClientModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      
      // Act
      const response = await request(app)
        .put('/api/clients/nonexistent')
        .send({ name: 'Updated Name' });
      
      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Client not found' });
    });
  });
  
  describe('DELETE /api/clients/:id', () => {
    it('should delete a client', async () => {
      // Arrange
      const clientId = 'client1';
      const deletedClient = {
        _id: clientId,
        name: 'Client 1'
      };
      
      (ClientModel.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedClient);
      
      // Act
      const response = await request(app).delete(`/api/clients/${clientId}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Client deleted successfully' });
      expect(ClientModel.findByIdAndDelete).toHaveBeenCalledWith(clientId);
    });
    
    it('should return 404 if client not found', async () => {
      // Arrange
      (ClientModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      
      // Act
      const response = await request(app).delete('/api/clients/nonexistent');
      
      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Client not found' });
    });
  });
});

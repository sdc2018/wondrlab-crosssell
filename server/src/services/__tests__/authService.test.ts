import { AuthService } from '../authService';
import { UserModel } from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';

// Mock dependencies
jest.mock('../../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../config', () => ({
  jwtSecret: 'test-secret',
  jwtExpiration: '1h'
}));

describe('AuthService', () => {
  let authService: AuthService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
  });
  
  describe('registerUser', () => {
    it('should hash password and create a new user', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'Sales Rep'
      };
      
      const hashedPassword = 'hashed_password';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      
      const savedUser = {
        _id: 'user_id',
        ...userData,
        password: hashedPassword
      };
      (UserModel.create as jest.Mock).mockResolvedValue(savedUser);
      
      // Act
      const result = await authService.registerUser(userData);
      
      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(UserModel.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword
      });
      expect(result).toEqual({
        _id: 'user_id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'Sales Rep'
      });
      // Ensure password is not returned
      expect(result.password).toBeUndefined();
    });
    
    it('should throw an error if user already exists', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'Sales Rep'
      };
      
      (UserModel.findOne as jest.Mock).mockResolvedValue({ email: 'test@example.com' });
      
      // Act & Assert
      await expect(authService.registerUser(userData)).rejects.toThrow('User already exists');
      expect(UserModel.create).not.toHaveBeenCalled();
    });
  });
  
  describe('loginUser', () => {
    it('should return a token if credentials are valid', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const user = {
        _id: 'user_id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password',
        role: 'Sales Rep'
      };
      
      (UserModel.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('generated_token');
      
      // Act
      const result = await authService.loginUser(loginData);
      
      // Assert
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 'user_id', role: 'Sales Rep' },
        'test-secret',
        { expiresIn: '1h' }
      );
      expect(result).toEqual({
        token: 'generated_token',
        user: {
          _id: 'user_id',
          name: 'Test User',
          email: 'test@example.com',
          role: 'Sales Rep'
        }
      });
      // Ensure password is not returned
      expect(result.user.password).toBeUndefined();
    });
    
    it('should throw an error if user does not exist', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      
      // Act & Assert
      await expect(authService.loginUser(loginData)).rejects.toThrow('Invalid credentials');
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });
    
    it('should throw an error if password is invalid', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const user = {
        _id: 'user_id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password',
        role: 'Sales Rep'
      };
      
      (UserModel.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      
      // Act & Assert
      await expect(authService.loginUser(loginData)).rejects.toThrow('Invalid credentials');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
  
  describe('verifyToken', () => {
    it('should return decoded token data if token is valid', () => {
      // Arrange
      const token = 'valid_token';
      const decodedToken = {
        userId: 'user_id',
        role: 'Sales Rep'
      };
      
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
      
      // Act
      const result = authService.verifyToken(token);
      
      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(token, 'test-secret');
      expect(result).toEqual(decodedToken);
    });
    
    it('should throw an error if token is invalid', () => {
      // Arrange
      const token = 'invalid_token';
      
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      // Act & Assert
      expect(() => authService.verifyToken(token)).toThrow('Invalid token');
      expect(jwt.verify).toHaveBeenCalledWith(token, 'test-secret');
    });
  });
});

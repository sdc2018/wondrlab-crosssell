import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { UserRole } from '../models/User';

/**
 * Controller for handling User-related HTTP requests
 */
export class UserController {
  private static userService = new UserService();

  /**
   * Register a new user
   * @param req Express request object
   * @param res Express response object
   */
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, firstName, lastName, role, businessUnitId } = req.body;
      
      // Validate required fields
      if (!username || !email || !password || !firstName || !lastName) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
        return;
      }
      
      // Create user
      const newUser = await UserController.userService.create({
        username,
        email,
        password,
        firstName,
        lastName,
        role,
        businessUnitId
      });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;
      
      res.status(201).json({
        success: true,
        data: userWithoutPassword,
        message: 'User registered successfully'
      });
    } catch (error) {
      console.error('Error in UserController.register:', error);
      
      // Handle duplicate username or email
      if (error.message.includes('already exists')) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to register user',
        error: error.message
      });
    }
  }

  /**
   * Login a user
   * @param req Express request object
   * @param res Express response object
   */
  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { usernameOrEmail, password } = req.body;
      
      // Validate required fields
      if (!usernameOrEmail || !password) {
        res.status(400).json({
          success: false,
          message: 'Username/email and password are required'
        });
        return;
      }
      
      // Authenticate user
      const user = await UserController.userService.authenticate(usernameOrEmail, password);
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
        return;
      }
      
      // Generate JWT token
      const token = UserController.userService.generateToken(user);
      
      res.status(200).json({
        success: true,
        data: {
          token,
          user: user.toJSON()
        },
        message: 'Login successful'
      });
    } catch (error) {
      console.error('Error in UserController.login:', error);
      
      // Handle inactive account
      if (error.message.includes('inactive')) {
        res.status(403).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message
      });
    }
  }

  /**
   * Get all users with optional filtering
   * @param req Express request object
   * @param res Express response object
   */
  public static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, role, businessUnitId, isActive } = req.query;
      const filters = {
        username: username as string,
        email: email as string,
        role: role as UserRole,
        businessUnitId: businessUnitId as string,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
      };
      
      const users = await UserController.userService.findAll(filters);
      
      // Remove passwords from response
      const usersWithoutPasswords = users.map(user => user.toJSON());
      
      res.status(200).json({
        success: true,
        data: usersWithoutPasswords
      });
    } catch (error) {
      console.error('Error in UserController.getUsers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        error: error.message
      });
    }
  }

  /**
   * Get a user by ID
   * @param req Express request object
   * @param res Express response object
   */
  public static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await UserController.userService.findById(id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: `User with ID ${id} not found`
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: user.toJSON()
      });
    } catch (error) {
      console.error(`Error in UserController.getUserById for ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user',
        error: error.message
      });
    }
  }

  /**
   * Get current user from token
   * @param req Express request object
   * @param res Express response object
   */
  public static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      // Get user ID from authenticated request (set by auth middleware)
      const userId = (req as any).userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
        return;
      }
      
      const user = await UserController.userService.findById(userId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: user.toJSON()
      });
    } catch (error) {
      console.error('Error in UserController.getCurrentUser:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch current user',
        error: error.message
      });
    }
  }

  /**
   * Update a user
   * @param req Express request object
   * @param res Express response object
   */
  public static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { username, email, firstName, lastName, role, businessUnitId, isActive } = req.body;
      
      // Update user
      const updatedUser = await UserController.userService.update(id, {
        username,
        email,
        firstName,
        lastName,
        role,
        businessUnitId,
        isActive
      });
      
      res.status(200).json({
        success: true,
        data: updatedUser.toJSON(),
        message: 'User updated successfully'
      });
    } catch (error) {
      console.error(`Error in UserController.updateUser for ID ${req.params.id}:`, error);
      
      // Handle not found error
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      // Handle duplicate username or email
      if (error.message.includes('already exists')) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to update user',
        error: error.message
      });
    }
  }

  /**
   * Delete a user
   * @param req Express request object
   * @param res Express response object
   */
  public static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await UserController.userService.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error(`Error in UserController.deleteUser for ID ${req.params.id}:`, error);
      
      // Handle not found error
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      // Handle business unit head error
      if (error.message.includes('business unit')) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        error: error.message
      });
    }
  }

  /**
   * Change user password
   * @param req Express request object
   * @param res Express response object
   */
  public static async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;
      
      // Validate required fields
      if (!currentPassword || !newPassword) {
        res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
        return;
      }
      
      // Change password
      await UserController.userService.changePassword(id, currentPassword, newPassword);
      
      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error(`Error in UserController.changePassword for ID ${req.params.id}:`, error);
      
      // Handle not found error
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      // Handle incorrect password error
      if (error.message.includes('incorrect')) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to change password',
        error: error.message
      });
    }
  }

  /**
   * Get users by role
   * @param req Express request object
   * @param res Express response object
   */
  public static async getUsersByRole(req: Request, res: Response): Promise<void> {
    try {
      const { role } = req.params;
      
      // Validate role
      if (!Object.values(UserRole).includes(role as UserRole)) {
        res.status(400).json({
          success: false,
          message: `Invalid role: ${role}`
        });
        return;
      }
      
      const users = await UserController.userService.findByRole(role as UserRole);
      
      // Remove passwords from response
      const usersWithoutPasswords = users.map(user => user.toJSON());
      
      res.status(200).json({
        success: true,
        data: usersWithoutPasswords
      });
    } catch (error) {
      console.error(`Error in UserController.getUsersByRole for role ${req.params.role}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users by role',
        error: error.message
      });
    }
  }

  /**
   * Get users by business unit
   * @param req Express request object
   * @param res Express response object
   */
  public static async getUsersByBusinessUnit(req: Request, res: Response): Promise<void> {
    try {
      const { businessUnitId } = req.params;
      const users = await UserController.userService.findByBusinessUnit(businessUnitId);
      
      // Remove passwords from response
      const usersWithoutPasswords = users.map(user => user.toJSON());
      
      res.status(200).json({
        success: true,
        data: usersWithoutPasswords
      });
    } catch (error) {
      console.error(`Error in UserController.getUsersByBusinessUnit for business unit ID ${req.params.businessUnitId}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users by business unit',
        error: error.message
      });
    }
  }
}

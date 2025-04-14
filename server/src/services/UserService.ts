import { getRepository, Repository } from 'typeorm';
import { User, UserRole } from '../models/User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

/**
 * Service class for handling User-related business logic
 */
export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = getRepository(User);
  }

  /**
   * Get all users with optional filtering
   * @param filters Optional filters for username, email, role, businessUnitId
   * @returns Promise resolving to an array of users
   */
  public async findAll(filters?: {
    username?: string;
    email?: string;
    role?: UserRole;
    businessUnitId?: string;
    isActive?: boolean;
  }): Promise<User[]> {
    try {
      let query = this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.businessUnit', 'businessUnit');
      
      // Apply filters if provided
      if (filters) {
        if (filters.username) {
          query = query.andWhere('user.username LIKE :username', { username: `%${filters.username}%` });
        }
        
        if (filters.email) {
          query = query.andWhere('user.email LIKE :email', { email: `%${filters.email}%` });
        }
        
        if (filters.role) {
          query = query.andWhere('user.role = :role', { role: filters.role });
        }
        
        if (filters.businessUnitId) {
          query = query.andWhere('businessUnit.id = :businessUnitId', { businessUnitId: filters.businessUnitId });
        }
        
        if (filters.isActive !== undefined) {
          query = query.andWhere('user.isActive = :isActive', { isActive: filters.isActive });
        }
      }
      
      return await query.getMany();
    } catch (error) {
      console.error('Error in UserService.findAll:', error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  /**
   * Get a user by ID
   * @param id User ID
   * @returns Promise resolving to a user or null if not found
   */
  public async findById(id: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: { id },
        relations: ['businessUnit', 'managedBusinessUnits']
      });
    } catch (error) {
      console.error(`Error in UserService.findById for ID ${id}:`, error);
      throw new Error(`Failed to fetch user with ID ${id}: ${error.message}`);
    }
  }

  /**
   * Find a user by username
   * @param username Username to search for
   * @returns Promise resolving to a user or null if not found
   */
  public async findByUsername(username: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: { username },
        relations: ['businessUnit']
      });
    } catch (error) {
      console.error(`Error in UserService.findByUsername for username ${username}:`, error);
      throw new Error(`Failed to fetch user with username ${username}: ${error.message}`);
    }
  }

  /**
   * Find a user by email
   * @param email Email to search for
   * @returns Promise resolving to a user or null if not found
   */
  public async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: { email },
        relations: ['businessUnit']
      });
    } catch (error) {
      console.error(`Error in UserService.findByEmail for email ${email}:`, error);
      throw new Error(`Failed to fetch user with email ${email}: ${error.message}`);
    }
  }

  /**
   * Create a new user
   * @param userData User data
   * @returns Promise resolving to the created user
   */
  public async create(userData: Partial<User>): Promise<User> {
    try {
      // Validate required fields
      if (!userData.username) {
        throw new Error('Username is required');
      }
      
      if (!userData.email) {
        throw new Error('Email is required');
      }
      
      if (!userData.password) {
        throw new Error('Password is required');
      }
      
      if (!userData.firstName) {
        throw new Error('First name is required');
      }
      
      if (!userData.lastName) {
        throw new Error('Last name is required');
      }
      
      // Check if user with same username or email already exists
      const existingUsername = await this.findByUsername(userData.username);
      if (existingUsername) {
        throw new Error(`User with username "${userData.username}" already exists`);
      }
      
      const existingEmail = await this.findByEmail(userData.email);
      if (existingEmail) {
        throw new Error(`User with email "${userData.email}" already exists`);
      }
      
      // Set default values if not provided
      if (userData.isActive === undefined) {
        userData.isActive = true;
      }
      
      if (!userData.role) {
        userData.role = UserRole.SALES;
      }
      
      // Create and save user
      const newUser = this.userRepository.create(userData);
      return await this.userRepository.save(newUser);
    } catch (error) {
      console.error('Error in UserService.create:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  /**
   * Update an existing user
   * @param id User ID
   * @param userData Updated user data
   * @returns Promise resolving to the updated user
   */
  public async update(id: string, userData: Partial<User>): Promise<User> {
    try {
      // Find user by ID
      const user = await this.findById(id);
      
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      
      // Check if user with same username already exists (but not the same user)
      if (userData.username && userData.username !== user.username) {
        const existingUsername = await this.findByUsername(userData.username);
        if (existingUsername) {
          throw new Error(`User with username "${userData.username}" already exists`);
        }
      }
      
      // Check if user with same email already exists (but not the same user)
      if (userData.email && userData.email !== user.email) {
        const existingEmail = await this.findByEmail(userData.email);
        if (existingEmail) {
          throw new Error(`User with email "${userData.email}" already exists`);
        }
      }
      
      // Update user
      this.userRepository.merge(user, userData);
      return await this.userRepository.save(user);
    } catch (error) {
      console.error(`Error in UserService.update for ID ${id}:`, error);
      throw new Error(`Failed to update user with ID ${id}: ${error.message}`);
    }
  }

  /**
   * Delete a user
   * @param id User ID
   * @returns Promise resolving to boolean indicating success
   */
  public async delete(id: string): Promise<boolean> {
    try {
      // Find user by ID
      const user = await this.findById(id);
      
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      
      // Check if user is a business unit head
      if (user.managedBusinessUnits && user.managedBusinessUnits.length > 0) {
        throw new Error(`Cannot delete user with ID ${id} because they are a head of one or more business units`);
      }
      
      // Delete user
      await this.userRepository.remove(user);
      return true;
    } catch (error) {
      console.error(`Error in UserService.delete for ID ${id}:`, error);
      throw new Error(`Failed to delete user with ID ${id}: ${error.message}`);
    }
  }

  /**
   * Authenticate a user with username/email and password
   * @param usernameOrEmail Username or email
   * @param password Password
   * @returns Promise resolving to authenticated user or null if authentication fails
   */
  public async authenticate(usernameOrEmail: string, password: string): Promise<User | null> {
    try {
      // Find user by username or email
      const user = await this.userRepository.findOne({
        where: [
          { username: usernameOrEmail },
          { email: usernameOrEmail }
        ]
      });
      
      if (!user) {
        return null;
      }
      
      // Check if user is active
      if (!user.isActive) {
        throw new Error('User account is inactive');
      }
      
      // Check password
      const isPasswordValid = await user.checkPassword(password);
      
      if (!isPasswordValid) {
        return null;
      }
      
      // Update last login
      user.lastLogin = new Date();
      await this.userRepository.save(user);
      
      return user;
    } catch (error) {
      console.error(`Error in UserService.authenticate for user ${usernameOrEmail}:`, error);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Generate a JWT token for a user
   * @param user User to generate token for
   * @returns JWT token
   */
  public generateToken(user: User): string {
    try {
      const payload = {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        businessUnitId: user.businessUnitId
      };
      
      // In a real application, the secret would be in an environment variable
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      
      // Token expires in 24 hours
      return jwt.sign(payload, secret, { expiresIn: '24h' });
    } catch (error) {
      console.error(`Error in UserService.generateToken for user ${user.id}:`, error);
      throw new Error(`Failed to generate token: ${error.message}`);
    }
  }

  /**
   * Verify a JWT token
   * @param token JWT token to verify
   * @returns Decoded token payload
   */
  public verifyToken(token: string): any {
    try {
      // In a real application, the secret would be in an environment variable
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      
      return jwt.verify(token, secret);
    } catch (error) {
      console.error(`Error in UserService.verifyToken:`, error);
      throw new Error(`Failed to verify token: ${error.message}`);
    }
  }

  /**
   * Change a user's password
   * @param id User ID
   * @param currentPassword Current password
   * @param newPassword New password
   * @returns Promise resolving to boolean indicating success
   */
  public async changePassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      // Find user by ID
      const user = await this.findById(id);
      
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      
      // Check current password
      const isPasswordValid = await user.checkPassword(currentPassword);
      
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }
      
      // Update password
      user.password = newPassword;
      await this.userRepository.save(user);
      
      return true;
    } catch (error) {
      console.error(`Error in UserService.changePassword for user ${id}:`, error);
      throw new Error(`Failed to change password: ${error.message}`);
    }
  }

  /**
   * Find users by role
   * @param role Role to search for
   * @returns Promise resolving to an array of users
   */
  public async findByRole(role: UserRole): Promise<User[]> {
    try {
      return await this.findAll({ role });
    } catch (error) {
      console.error(`Error in UserService.findByRole for role ${role}:`, error);
      throw new Error(`Failed to fetch users with role ${role}: ${error.message}`);
    }
  }

  /**
   * Find users by business unit
   * @param businessUnitId Business Unit ID
   * @returns Promise resolving to an array of users
   */
  public async findByBusinessUnit(businessUnitId: string): Promise<User[]> {
    try {
      return await this.findAll({ businessUnitId });
    } catch (error) {
      console.error(`Error in UserService.findByBusinessUnit for business unit ID ${businessUnitId}:`, error);
      throw new Error(`Failed to fetch users for business unit with ID ${businessUnitId}: ${error.message}`);
    }
  }

  /**
   * Find active users
   * @returns Promise resolving to an array of active users
   */
  public async findActive(): Promise<User[]> {
    try {
      return await this.findAll({ isActive: true });
    } catch (error) {
      console.error('Error in UserService.findActive:', error);
      throw new Error(`Failed to fetch active users: ${error.message}`);
    }
  }
}

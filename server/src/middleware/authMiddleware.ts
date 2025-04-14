import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { UserRole } from '../models/User';

/**
 * Middleware for authentication and authorization
 */
export class AuthMiddleware {
  private static userService = new UserService();

  /**
   * Middleware to verify JWT token and set user ID in request
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function
   */
  public static async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: 'No token provided'
        });
        return;
      }
      
      const token = authHeader.split(' ')[1];
      
      // Verify token
      const decoded = AuthMiddleware.userService.verifyToken(token);
      
      // Set user ID in request for use in controllers
      (req as any).userId = decoded.userId;
      (req as any).userRole = decoded.role;
      (req as any).userBusinessUnitId = decoded.businessUnitId;
      
      next();
    } catch (error) {
      console.error('Error in AuthMiddleware.verifyToken:', error);
      
      // Handle token expiration
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          message: 'Token expired'
        });
        return;
      }
      
      // Handle invalid token
      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Authentication failed',
        error: error.message
      });
    }
  }

  /**
   * Middleware to check if user has admin role
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function
   */
  public static isAdmin(req: Request, res: Response, next: NextFunction): void {
    try {
      const userRole = (req as any).userRole;
      
      if (userRole !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          message: 'Access denied: Admin role required'
        });
        return;
      }
      
      next();
    } catch (error) {
      console.error('Error in AuthMiddleware.isAdmin:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization failed',
        error: error.message
      });
    }
  }

  /**
   * Middleware to check if user has business unit head role
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function
   */
  public static isBusinessUnitHead(req: Request, res: Response, next: NextFunction): void {
    try {
      const userRole = (req as any).userRole;
      
      if (userRole !== UserRole.BU_HEAD && userRole !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          message: 'Access denied: Business Unit Head or Admin role required'
        });
        return;
      }
      
      next();
    } catch (error) {
      console.error('Error in AuthMiddleware.isBusinessUnitHead:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization failed',
        error: error.message
      });
    }
  }

  /**
   * Middleware to check if user has management role
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function
   */
  public static isManagement(req: Request, res: Response, next: NextFunction): void {
    try {
      const userRole = (req as any).userRole;
      
      if (userRole !== UserRole.MANAGEMENT && userRole !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          message: 'Access denied: Management or Admin role required'
        });
        return;
      }
      
      next();
    } catch (error) {
      console.error('Error in AuthMiddleware.isManagement:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization failed',
        error: error.message
      });
    }
  }

  /**
   * Middleware to check if user is accessing their own resource
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function
   */
  public static isSelf(req: Request, res: Response, next: NextFunction): void {
    try {
      const userId = (req as any).userId;
      const resourceId = req.params.id;
      
      if (userId !== resourceId) {
        res.status(403).json({
          success: false,
          message: 'Access denied: You can only access your own resources'
        });
        return;
      }
      
      next();
    } catch (error) {
      console.error('Error in AuthMiddleware.isSelf:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization failed',
        error: error.message
      });
    }
  }

  /**
   * Middleware to check if user is accessing their own resource or has admin role
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function
   */
  public static isSelfOrAdmin(req: Request, res: Response, next: NextFunction): void {
    try {
      const userId = (req as any).userId;
      const userRole = (req as any).userRole;
      const resourceId = req.params.id;
      
      if (userId !== resourceId && userRole !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          message: 'Access denied: You can only access your own resources or you need admin role'
        });
        return;
      }
      
      next();
    } catch (error) {
      console.error('Error in AuthMiddleware.isSelfOrAdmin:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization failed',
        error: error.message
      });
    }
  }

  /**
   * Middleware to check if user belongs to the same business unit
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function
   */
  public static isSameBusinessUnit(req: Request, res: Response, next: NextFunction): void {
    try {
      const userBusinessUnitId = (req as any).userBusinessUnitId;
      const resourceBusinessUnitId = req.params.businessUnitId;
      
      if (userBusinessUnitId !== resourceBusinessUnitId) {
        res.status(403).json({
          success: false,
          message: 'Access denied: You can only access resources from your own business unit'
        });
        return;
      }
      
      next();
    } catch (error) {
      console.error('Error in AuthMiddleware.isSameBusinessUnit:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization failed',
        error: error.message
      });
    }
  }
}

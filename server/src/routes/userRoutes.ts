import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = Router();

/**
 * Public routes (no authentication required)
 */

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', UserController.register);

/**
 * @route   POST /api/users/login
 * @desc    Login a user
 * @access  Public
 */
router.post('/login', UserController.login);

/**
 * Protected routes (authentication required)
 */

/**
 * @route   GET /api/users/me
 * @desc    Get current user from token
 * @access  Private
 */
router.get('/me', AuthMiddleware.verifyToken, UserController.getCurrentUser);

/**
 * @route   GET /api/users
 * @desc    Get all users with optional filtering
 * @access  Private (Admin only)
 */
router.get('/', AuthMiddleware.verifyToken, AuthMiddleware.isAdmin, UserController.getUsers);

/**
 * @route   GET /api/users/role/:role
 * @desc    Get users by role
 * @access  Private (Admin only)
 */
router.get('/role/:role', AuthMiddleware.verifyToken, AuthMiddleware.isAdmin, UserController.getUsersByRole);

/**
 * @route   GET /api/users/business-unit/:businessUnitId
 * @desc    Get users by business unit
 * @access  Private (Admin or BU Head)
 */
router.get(
  '/business-unit/:businessUnitId',
  AuthMiddleware.verifyToken,
  (req, res, next) => {
    // Allow BU Heads to access their own business unit
    const userRole = (req as any).userRole;
    const userBusinessUnitId = (req as any).userBusinessUnitId;
    const requestedBusinessUnitId = req.params.businessUnitId;
    
    if (userRole === 'bu_head' && userBusinessUnitId === requestedBusinessUnitId) {
      return next();
    }
    
    // Otherwise, require admin role
    AuthMiddleware.isAdmin(req, res, next);
  },
  UserController.getUsersByBusinessUnit
);

/**
 * @route   GET /api/users/:id
 * @desc    Get a user by ID
 * @access  Private (Admin or self)
 */
router.get('/:id', AuthMiddleware.verifyToken, AuthMiddleware.isSelfOrAdmin, UserController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update a user
 * @access  Private (Admin or self)
 */
router.put('/:id', AuthMiddleware.verifyToken, AuthMiddleware.isSelfOrAdmin, UserController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user
 * @access  Private (Admin only)
 */
router.delete('/:id', AuthMiddleware.verifyToken, AuthMiddleware.isAdmin, UserController.deleteUser);

/**
 * @route   POST /api/users/:id/change-password
 * @desc    Change user password
 * @access  Private (Admin or self)
 */
router.post('/:id/change-password', AuthMiddleware.verifyToken, AuthMiddleware.isSelfOrAdmin, UserController.changePassword);

export default router;
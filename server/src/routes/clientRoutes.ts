import { Router } from 'express';
import { ClientController } from '../controllers/ClientController';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = Router();

/**
 * Apply authentication middleware to all routes
 * All client routes require authentication
 */
router.use(AuthMiddleware.verifyToken);

/**
 * @route   GET /api/clients
 * @desc    Get all clients with optional filtering
 * @access  Private
 */
router.get('/', ClientController.getClients);

/**
 * @route   GET /api/clients/active
 * @desc    Get active clients
 * @access  Private
 */
router.get('/active', ClientController.getActiveClients);

/**
 * @route   GET /api/clients/business-unit/:businessUnitId
 * @desc    Get clients by business unit
 * @access  Private (Admin, BU Head, or same BU)
 */
router.get(
  '/business-unit/:businessUnitId',
  (req, res, next) => {
    const userRole = (req as any).userRole;
    const userBusinessUnitId = (req as any).userBusinessUnitId;
    const requestedBusinessUnitId = req.params.businessUnitId;
    
    // Allow access if user is admin, BU head, or from the same BU
    if (
      userRole === 'admin' || 
      userRole === 'bu_head' || 
      userBusinessUnitId === requestedBusinessUnitId
    ) {
      return next();
    }
    
    res.status(403).json({
      success: false,
      message: 'Access denied: You can only access clients from your own business unit'
    });
  },
  ClientController.getClientsByBusinessUnit
);

/**
 * @route   GET /api/clients/region/:region
 * @desc    Get clients by region
 * @access  Private
 */
router.get('/region/:region', ClientController.getClientsByRegion);

/**
 * @route   GET /api/clients/industry/:industry
 * @desc    Get clients by industry
 * @access  Private
 */
router.get('/industry/:industry', ClientController.getClientsByIndustry);

/**
 * @route   GET /api/clients/:id
 * @desc    Get a client by ID
 * @access  Private
 */
router.get('/:id', ClientController.getClientById);

/**
 * @route   POST /api/clients
 * @desc    Create a new client
 * @access  Private (Admin, BU Head, or Management)
 */
router.post(
  '/',
  (req, res, next) => {
    const userRole = (req as any).userRole;
    
    // Allow access if user is admin, BU head, or management
    if (
      userRole === 'admin' || 
      userRole === 'bu_head' || 
      userRole === 'management'
    ) {
      return next();
    }
    
    res.status(403).json({
      success: false,
      message: 'Access denied: Only admin, business unit heads, or management can create clients'
    });
  },
  ClientController.createClient
);

/**
 * @route   PUT /api/clients/:id
 * @desc    Update an existing client
 * @access  Private (Admin, BU Head, or Management)
 */
router.put(
  '/:id',
  (req, res, next) => {
    const userRole = (req as any).userRole;
    
    // Allow access if user is admin, BU head, or management
    if (
      userRole === 'admin' || 
      userRole === 'bu_head' || 
      userRole === 'management'
    ) {
      return next();
    }
    
    res.status(403).json({
      success: false,
      message: 'Access denied: Only admin, business unit heads, or management can update clients'
    });
  },
  ClientController.updateClient
);

/**
 * @route   DELETE /api/clients/:id
 * @desc    Delete a client
 * @access  Private (Admin only)
 */
router.delete('/:id', AuthMiddleware.isAdmin, ClientController.deleteClient);

export default router;
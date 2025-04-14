import { Router } from 'express';
import { BusinessUnitController } from '../controllers/BusinessUnitController';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = Router();

/**
 * Apply authentication middleware to all routes
 * All business unit routes require authentication
 */
router.use(AuthMiddleware.verifyToken);

/**
 * @route   GET /api/business-units
 * @desc    Get all business units with optional filtering
 * @access  Private
 */
router.get('/', BusinessUnitController.getBusinessUnits);

/**
 * @route   GET /api/business-units/active
 * @desc    Get active business units
 * @access  Private
 */
router.get('/active', BusinessUnitController.getActiveBusinessUnits);

/**
 * @route   GET /api/business-units/:id/services
 * @desc    Get services for a business unit
 * @access  Private
 */
router.get('/:id/services', BusinessUnitController.getBusinessUnitServices);

/**
 * @route   GET /api/business-units/:id/opportunities
 * @desc    Get opportunities for a business unit
 * @access  Private (Admin, BU Head, or same BU)
 */
router.get(
  '/:id/opportunities',
  (req, res, next) => {
    const userRole = (req as any).userRole;
    const userBusinessUnitId = (req as any).userBusinessUnitId;
    const requestedBusinessUnitId = req.params.id;
    
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
      message: 'Access denied: You can only access opportunities from your own business unit'
    });
  },
  BusinessUnitController.getBusinessUnitOpportunities
);

/**
 * @route   GET /api/business-units/:id
 * @desc    Get a business unit by ID
 * @access  Private
 */
router.get('/:id', BusinessUnitController.getBusinessUnitById);

/**
 * @route   POST /api/business-units
 * @desc    Create a new business unit
 * @access  Private (Admin only)
 */
router.post('/', AuthMiddleware.isAdmin, BusinessUnitController.createBusinessUnit);

/**
 * @route   PUT /api/business-units/:id
 * @desc    Update an existing business unit
 * @access  Private (Admin or BU Head of this BU)
 */
router.put(
  '/:id',
  async (req, res, next) => {
    try {
      const userRole = (req as any).userRole;
      const userBusinessUnitId = (req as any).userBusinessUnitId;
      const requestedBusinessUnitId = req.params.id;
      
      // Admin can update any business unit
      if (userRole === 'admin') {
        return next();
      }
      
      // BU head can update their own business unit
      if (userRole === 'bu_head' && userBusinessUnitId === requestedBusinessUnitId) {
        return next();
      }
      
      res.status(403).json({
        success: false,
        message: 'Access denied: Only admin or the business unit head can update a business unit'
      });
    } catch (error) {
      console.error('Error in business unit update authorization:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization failed',
        error: error.message
      });
    }
  },
  BusinessUnitController.updateBusinessUnit
);

/**
 * @route   DELETE /api/business-units/:id
 * @desc    Delete a business unit
 * @access  Private (Admin only)
 */
router.delete('/:id', AuthMiddleware.isAdmin, BusinessUnitController.deleteBusinessUnit);

export default router;
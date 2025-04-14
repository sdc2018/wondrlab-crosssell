import { Router } from 'express';
import { ServiceController } from '../controllers/ServiceController';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = Router();

/**
 * Apply authentication middleware to all routes
 * All service routes require authentication
 */
router.use(AuthMiddleware.verifyToken);

/**
 * @route   GET /api/services
 * @desc    Get all services with optional filtering
 * @access  Private
 */
router.get('/', ServiceController.getServices);

/**
 * @route   GET /api/services/active
 * @desc    Get active services
 * @access  Private
 */
router.get('/active', ServiceController.getActiveServices);

/**
 * @route   GET /api/services/business-unit/:businessUnitId
 * @desc    Get services by business unit
 * @access  Private
 */
router.get('/business-unit/:businessUnitId', ServiceController.getServicesByBusinessUnit);

/**
 * @route   GET /api/services/category/:category
 * @desc    Get services by category
 * @access  Private
 */
router.get('/category/:category', ServiceController.getServicesByCategory);

/**
 * @route   GET /api/services/:id
 * @desc    Get a service by ID
 * @access  Private
 */
router.get('/:id', ServiceController.getServiceById);

/**
 * @route   POST /api/services
 * @desc    Create a new service
 * @access  Private (Admin or BU Head)
 */
router.post('/', AuthMiddleware.isBusinessUnitHead, ServiceController.createService);

/**
 * @route   PUT /api/services/:id
 * @desc    Update an existing service
 * @access  Private (Admin or BU Head of the service's BU)
 */
router.put(
  '/:id',
  async (req, res, next) => {
    try {
      const userRole = (req as any).userRole;
      const userBusinessUnitId = (req as any).userBusinessUnitId;
      const serviceId = req.params.id;
      
      // Admin can update any service
      if (userRole === 'admin') {
        return next();
      }
      
      // Get the service to check business unit
      const service = await ServiceController.getServiceForAuth(serviceId);
      
      // If service not found, let the controller handle it
      if (!service) {
        return next();
      }
      
      // BU head can update services in their business unit
      if (userRole === 'bu_head' && service.businessUnitId === userBusinessUnitId) {
        return next();
      }
      
      res.status(403).json({
        success: false,
        message: 'Access denied: Only admin or the business unit head can update a service'
      });
    } catch (error) {
      console.error('Error in service update authorization:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization failed',
        error: error.message
      });
    }
  },
  ServiceController.updateService
);

/**
 * @route   DELETE /api/services/:id
 * @desc    Delete a service
 * @access  Private (Admin only)
 */
router.delete('/:id', AuthMiddleware.isAdmin, ServiceController.deleteService);

export default router;
import { Router } from 'express';
import { OpportunityController } from '../controllers/OpportunityController';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = Router();

/**
 * Apply authentication middleware to all routes
 * All opportunity routes require authentication
 */
router.use(AuthMiddleware.verifyToken);

/**
 * @route   GET /api/opportunities
 * @desc    Get all opportunities with optional filtering
 * @access  Private
 */
router.get('/', OpportunityController.getOpportunities);

/**
 * @route   GET /api/opportunities/status/:status
 * @desc    Get opportunities by status
 * @access  Private
 */
router.get('/status/:status', OpportunityController.getOpportunitiesByStatus);

/**
 * @route   GET /api/opportunities/client/:clientId
 * @desc    Get opportunities by client
 * @access  Private
 */
router.get('/client/:clientId', OpportunityController.getOpportunitiesByClient);

/**
 * @route   GET /api/opportunities/business-unit/:businessUnitId
 * @desc    Get opportunities by business unit
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
      message: 'Access denied: You can only access opportunities from your own business unit'
    });
  },
  OpportunityController.getOpportunitiesByBusinessUnit
);

/**
 * @route   GET /api/opportunities/service/:serviceId
 * @desc    Get opportunities by service
 * @access  Private
 */
router.get('/service/:serviceId', OpportunityController.getOpportunitiesByService);

/**
 * @route   GET /api/opportunities/high-value
 * @desc    Get high value opportunities
 * @access  Private (Admin, BU Head, or Management)
 */
router.get(
  '/high-value',
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
      message: 'Access denied: Only admin, business unit heads, or management can view high value opportunities'
    });
  },
  OpportunityController.getHighValueOpportunities
);

/**
 * @route   GET /api/opportunities/closing-soon
 * @desc    Get opportunities closing soon
 * @access  Private
 */
router.get('/closing-soon', OpportunityController.getOpportunitiesClosingSoon);

/**
 * @route   GET /api/opportunities/:id
 * @desc    Get an opportunity by ID
 * @access  Private
 */
router.get('/:id', OpportunityController.getOpportunityById);

/**
 * @route   POST /api/opportunities
 * @desc    Create a new opportunity
 * @access  Private
 */
router.post('/', OpportunityController.createOpportunity);

/**
 * @route   PUT /api/opportunities/:id
 * @desc    Update an existing opportunity
 * @access  Private (Admin, BU Head, or Creator)
 */
router.put(
  '/:id',
  async (req, res, next) => {
    try {
      const userRole = (req as any).userRole;
      const userId = (req as any).userId;
      const userBusinessUnitId = (req as any).userBusinessUnitId;
      const opportunityId = req.params.id;
      
      // Admin can update any opportunity
      if (userRole === 'admin') {
        return next();
      }
      
      // Get the opportunity to check ownership
      const opportunity = await OpportunityController.getOpportunityForAuth(opportunityId);
      
      // If opportunity not found, let the controller handle it
      if (!opportunity) {
        return next();
      }
      
      // BU head can update opportunities in their business unit
      if (userRole === 'bu_head' && opportunity.businessUnitId === userBusinessUnitId) {
        return next();
      }
      
      // Creator can update their own opportunities
      if (opportunity.createdBy === userId) {
        return next();
      }
      
      res.status(403).json({
        success: false,
        message: 'Access denied: You can only update opportunities you created or those in your business unit (if you are a BU head)'
      });
    } catch (error) {
      console.error('Error in opportunity update authorization:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization failed',
        error: error.message
      });
    }
  },
  OpportunityController.updateOpportunity
);

/**
 * @route   DELETE /api/opportunities/:id
 * @desc    Delete an opportunity
 * @access  Private (Admin only)
 */
router.delete('/:id', AuthMiddleware.isAdmin, OpportunityController.deleteOpportunity);

export default router;
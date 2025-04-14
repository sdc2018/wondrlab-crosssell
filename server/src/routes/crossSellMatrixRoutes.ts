import { Router } from 'express';
import { CrossSellMatrixController } from '../controllers/CrossSellMatrixController';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = Router();

/**
 * Apply authentication middleware to all routes
 * All cross-sell matrix routes require authentication
 */
router.use(AuthMiddleware.verifyToken);

/**
 * @route   GET /api/cross-sell-matrix
 * @desc    Get cross-sell matrix data with optional filtering
 * @access  Private (Admin, BU Head, or Management)
 */
router.get(
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
      message: 'Access denied: Only admin, business unit heads, or management can access the cross-sell matrix'
    });
  },
  CrossSellMatrixController.getMatrix
);

/**
 * @route   GET /api/cross-sell-matrix/high-opportunity
 * @desc    Get high opportunity cross-sell matrix items
 * @access  Private (Admin, BU Head, or Management)
 */
router.get(
  '/high-opportunity',
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
      message: 'Access denied: Only admin, business unit heads, or management can access high opportunity cross-sells'
    });
  },
  CrossSellMatrixController.getHighOpportunityMatrix
);

/**
 * @route   GET /api/cross-sell-matrix/client/:clientId
 * @desc    Get cross-sell matrix data for a specific client
 * @access  Private (Admin, BU Head, or Management)
 */
router.get(
  '/client/:clientId',
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
      message: 'Access denied: Only admin, business unit heads, or management can access client cross-sell opportunities'
    });
  },
  CrossSellMatrixController.getMatrixForClient
);

/**
 * @route   GET /api/cross-sell-matrix/business-unit/current/:businessUnitId
 * @desc    Get cross-sell matrix data for a specific business unit as the current business unit
 * @access  Private (Admin, BU Head of this BU, or Management)
 */
router.get(
  '/business-unit/current/:businessUnitId',
  (req, res, next) => {
    const userRole = (req as any).userRole;
    const userBusinessUnitId = (req as any).userBusinessUnitId;
    const requestedBusinessUnitId = req.params.businessUnitId;
    
    // Allow access if user is admin or management
    if (userRole === 'admin' || userRole === 'management') {
      return next();
    }
    
    // Allow BU head to access their own business unit
    if (userRole === 'bu_head' && userBusinessUnitId === requestedBusinessUnitId) {
      return next();
    }
    
    res.status(403).json({
      success: false,
      message: 'Access denied: You can only access cross-sell opportunities for your own business unit'
    });
  },
  CrossSellMatrixController.getMatrixForCurrentBusinessUnit
);

/**
 * @route   GET /api/cross-sell-matrix/business-unit/target/:businessUnitId
 * @desc    Get cross-sell matrix data for a specific business unit as the target business unit
 * @access  Private (Admin, BU Head of this BU, or Management)
 */
router.get(
  '/business-unit/target/:businessUnitId',
  (req, res, next) => {
    const userRole = (req as any).userRole;
    const userBusinessUnitId = (req as any).userBusinessUnitId;
    const requestedBusinessUnitId = req.params.businessUnitId;
    
    // Allow access if user is admin or management
    if (userRole === 'admin' || userRole === 'management') {
      return next();
    }
    
    // Allow BU head to access their own business unit
    if (userRole === 'bu_head' && userBusinessUnitId === requestedBusinessUnitId) {
      return next();
    }
    
    res.status(403).json({
      success: false,
      message: 'Access denied: You can only access cross-sell opportunities for your own business unit'
    });
  },
  CrossSellMatrixController.getMatrixForTargetBusinessUnit
);

/**
 * @route   GET /api/cross-sell-matrix/industry/:industry
 * @desc    Get cross-sell matrix data for a specific industry
 * @access  Private (Admin, BU Head, or Management)
 */
router.get(
  '/industry/:industry',
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
      message: 'Access denied: Only admin, business unit heads, or management can access industry cross-sell opportunities'
    });
  },
  CrossSellMatrixController.getMatrixForIndustry
);

/**
 * @route   GET /api/cross-sell-matrix/region/:region
 * @desc    Get cross-sell matrix data for a specific region
 * @access  Private (Admin, BU Head, or Management)
 */
router.get(
  '/region/:region',
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
      message: 'Access denied: Only admin, business unit heads, or management can access region cross-sell opportunities'
    });
  },
  CrossSellMatrixController.getMatrixForRegion
);

export default router;

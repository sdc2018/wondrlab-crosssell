import { Router } from 'express';
import { OpportunityController } from '../controllers/OpportunityController';

const router = Router();

/**
 * @route   GET /api/opportunities
 * @desc    Get all opportunities with optional filtering
 * @access  Private
 */
router.get('/', OpportunityController.getOpportunities);

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
 * @access  Private
 */
router.put('/:id', OpportunityController.updateOpportunity);

/**
 * @route   DELETE /api/opportunities/:id
 * @desc    Delete an opportunity
 * @access  Private
 */
router.delete('/:id', OpportunityController.deleteOpportunity);

/**
 * @route   PUT /api/opportunities/:id/status
 * @desc    Update opportunity status
 * @access  Private
 */
router.put('/:id/status', OpportunityController.updateOpportunityStatus);

/**
 * @route   GET /api/clients/:clientId/opportunities
 * @desc    Get opportunities by client
 * @access  Private
 */
router.get('/client/:clientId', OpportunityController.getOpportunitiesByClient);

/**
 * @route   GET /api/business-units/:businessUnitId/opportunities
 * @desc    Get opportunities by business unit
 * @access  Private
 */
router.get('/business-unit/:businessUnitId', OpportunityController.getOpportunitiesByBusinessUnit);

export default router;

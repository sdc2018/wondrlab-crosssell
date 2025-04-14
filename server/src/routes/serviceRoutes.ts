import { Router } from 'express';
import { ServiceController } from '../controllers/ServiceController';

const router = Router();

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
 * @access  Private
 */
router.post('/', ServiceController.createService);

/**
 * @route   PUT /api/services/:id
 * @desc    Update an existing service
 * @access  Private
 */
router.put('/:id', ServiceController.updateService);

/**
 * @route   DELETE /api/services/:id
 * @desc    Delete a service
 * @access  Private
 */
router.delete('/:id', ServiceController.deleteService);

export default router;

import { Router } from 'express';
import clientRoutes from './clientRoutes';
import opportunityRoutes from './opportunityRoutes';
import businessUnitRoutes from './businessUnitRoutes';
import serviceRoutes from './serviceRoutes';
import userRoutes from './userRoutes';
import crossSellMatrixRoutes from './crossSellMatrixRoutes';
import taskRoutes from './taskRoutes';

const router = Router();

/**
 * Client routes
 * Base path: /api/clients
 */
router.use('/clients', clientRoutes);

/**
 * Opportunity routes
 * Base path: /api/opportunities
 */
router.use('/opportunities', opportunityRoutes);

/**
 * Business Unit routes
 * Base path: /api/business-units
 */
router.use('/business-units', businessUnitRoutes);

/**
 * Service routes
 * Base path: /api/services
 */
router.use('/services', serviceRoutes);

/**
 * User routes
 * Base path: /api/users
 */
router.use('/users', userRoutes);

/**
 * Cross-Sell Matrix routes
 * Base path: /api/cross-sell-matrix
 */
router.use('/cross-sell-matrix', crossSellMatrixRoutes);

/**
 * Task routes
 * Base path: /api/tasks
 */
router.use('/tasks', taskRoutes);

export default router;

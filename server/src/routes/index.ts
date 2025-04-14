import { Router } from 'express';
import clientRoutes from './clientRoutes';
import opportunityRoutes from './opportunityRoutes';
import businessUnitRoutes from './businessUnitRoutes';
import serviceRoutes from './serviceRoutes';
import userRoutes from './userRoutes';

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

// Add more routes here as they are implemented
// Example: router.use('/tasks', taskRoutes);

export default router;

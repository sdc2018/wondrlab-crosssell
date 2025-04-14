import { Router } from 'express';
import clientRoutes from './clientRoutes';
import opportunityRoutes from './opportunityRoutes';

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

// Add more routes here as they are implemented
// Example: router.use('/business-units', businessUnitRoutes);
// Example: router.use('/services', serviceRoutes);

export default router;

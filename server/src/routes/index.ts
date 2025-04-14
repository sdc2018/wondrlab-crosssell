import { Router } from 'express';
import clientRoutes from './clientRoutes';

const router = Router();

/**
 * Client routes
 * Base path: /api/clients
 */
router.use('/clients', clientRoutes);

// Add more routes here as they are implemented
// Example: router.use('/business-units', businessUnitRoutes);
// Example: router.use('/services', serviceRoutes);
// Example: router.use('/opportunities', opportunityRoutes);

export default router;

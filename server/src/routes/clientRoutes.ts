import { Router } from 'express';
import { ClientController } from '../controllers/ClientController';

const router = Router();

/**
 * @route   GET /api/clients
 * @desc    Get all clients with optional filtering
 * @access  Private
 */
router.get('/', ClientController.getClients);

/**
 * @route   GET /api/clients/:id
 * @desc    Get a client by ID
 * @access  Private
 */
router.get('/:id', ClientController.getClientById);

/**
 * @route   POST /api/clients
 * @desc    Create a new client
 * @access  Private
 */
router.post('/', ClientController.createClient);

/**
 * @route   PUT /api/clients/:id
 * @desc    Update an existing client
 * @access  Private
 */
router.put('/:id', ClientController.updateClient);

/**
 * @route   DELETE /api/clients/:id
 * @desc    Delete a client
 * @access  Private
 */
router.delete('/:id', ClientController.deleteClient);

export default router;

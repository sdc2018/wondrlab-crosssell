import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = Router();

/**
 * Apply authentication middleware to all routes
 * All task routes require authentication
 */
router.use(AuthMiddleware.verifyToken);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post('/', TaskController.createTask);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks with optional filtering
 * @access  Private
 */
router.get('/', TaskController.getTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a task by ID
 * @access  Private
 */
router.get('/:id', TaskController.getTaskById);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
router.put('/:id', TaskController.updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete('/:id', TaskController.deleteTask);

/**
 * @route   GET /api/tasks/me/assigned
 * @desc    Get tasks assigned to the authenticated user
 * @access  Private
 */
router.get('/me/assigned', TaskController.getMyTasks);

/**
 * @route   GET /api/tasks/client/:clientId
 * @desc    Get tasks for a client
 * @access  Private
 */
router.get('/client/:clientId', TaskController.getTasksForClient);

/**
 * @route   GET /api/tasks/opportunity/:opportunityId
 * @desc    Get tasks for an opportunity
 * @access  Private
 */
router.get('/opportunity/:opportunityId', TaskController.getTasksForOpportunity);

/**
 * @route   GET /api/tasks/business-unit/:businessUnitId
 * @desc    Get tasks for a business unit
 * @access  Private
 */
router.get('/business-unit/:businessUnitId', TaskController.getTasksForBusinessUnit);

/**
 * @route   GET /api/tasks/overdue
 * @desc    Get overdue tasks
 * @access  Private
 */
router.get('/overdue', TaskController.getOverdueTasks);

export default router;

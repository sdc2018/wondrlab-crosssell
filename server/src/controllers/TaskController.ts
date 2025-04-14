import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { TaskStatus, TaskPriority } from '../models/Task';

/**
 * Controller for handling Task related HTTP requests
 */
export class TaskController {
  private static taskService = new TaskService();

  /**
   * Create a new task
   * @param req Express request object
   * @param res Express response object
   */
  public static async createTask(req: Request, res: Response): Promise<void> {
    try {
      const {
        title,
        description,
        priority,
        status,
        dueDate,
        assignedToId,
        opportunityId,
        clientId,
        businessUnitId,
        isReminder,
        reminderDate,
        category,
        tags,
        completionPercentage
      } = req.body;

      // Validate required fields
      if (!title) {
        res.status(400).json({
          success: false,
          message: 'Task title is required'
        });
        return;
      }

      if (!assignedToId) {
        res.status(400).json({
          success: false,
          message: 'Assigned user ID is required'
        });
        return;
      }

      // Get user ID from authenticated request
      const createdById = (req as any).userId;

      // Create task data
      const taskData = {
        title,
        description,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assignedToId,
        createdById,
        opportunityId,
        clientId,
        businessUnitId,
        isReminder,
        reminderDate: reminderDate ? new Date(reminderDate) : undefined,
        category,
        tags,
        completionPercentage
      };

      // Create task
      const task = await TaskController.taskService.createTask(taskData);

      res.status(201).json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Error in TaskController.createTask:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create task',
        error: error.message
      });
    }
  }

  /**
   * Get all tasks with optional filtering
   * @param req Express request object
   * @param res Express response object
   */
  public static async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const {
        status,
        priority,
        assignedToId,
        createdById,
        opportunityId,
        clientId,
        businessUnitId,
        isReminder,
        category,
        dueDateStart,
        dueDateEnd,
        isOverdue
      } = req.query;

      // Create filter options
      const filterOptions: any = {};

      // Status filter
      if (status) {
        filterOptions.status = status;
      }

      // Priority filter
      if (priority) {
        filterOptions.priority = priority;
      }

      // User filters
      if (assignedToId) {
        filterOptions.assignedToId = assignedToId as string;
      }

      if (createdById) {
        filterOptions.createdById = createdById as string;
      }

      // Related entity filters
      if (opportunityId) {
        filterOptions.opportunityId = opportunityId as string;
      }

      if (clientId) {
        filterOptions.clientId = clientId as string;
      }

      if (businessUnitId) {
        filterOptions.businessUnitId = businessUnitId as string;
      }

      // Reminder filter
      if (isReminder !== undefined) {
        filterOptions.isReminder = isReminder === 'true';
      }

      // Category filter
      if (category) {
        filterOptions.category = category as string;
      }

      // Due date filters
      if (dueDateStart) {
        filterOptions.dueDateStart = new Date(dueDateStart as string);
      }

      if (dueDateEnd) {
        filterOptions.dueDateEnd = new Date(dueDateEnd as string);
      }

      // Overdue filter
      if (isOverdue !== undefined) {
        filterOptions.isOverdue = isOverdue === 'true';
      }

      // Get tasks
      const tasks = await TaskController.taskService.getTasks(filterOptions);

      res.status(200).json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Error in TaskController.getTasks:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get tasks',
        error: error.message
      });
    }
  }

  /**
   * Get a task by ID
   * @param req Express request object
   * @param res Express response object
   */
  public static async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Get task
      const task = await TaskController.taskService.getTaskById(id);

      if (!task) {
        res.status(404).json({
          success: false,
          message: `Task with ID ${id} not found`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error(`Error in TaskController.getTaskById for task ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: `Failed to get task with ID ${req.params.id}`,
        error: error.message
      });
    }
  }

  /**
   * Update a task
   * @param req Express request object
   * @param res Express response object
   */
  public static async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        priority,
        status,
        dueDate,
        assignedToId,
        opportunityId,
        clientId,
        businessUnitId,
        isReminder,
        reminderDate,
        category,
        tags,
        completionPercentage
      } = req.body;

      // Create update data
      const updateData: any = {};

      // Only include fields that are provided
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (priority !== undefined) updateData.priority = priority;
      if (status !== undefined) updateData.status = status;
      if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
      if (assignedToId !== undefined) updateData.assignedToId = assignedToId;
      if (opportunityId !== undefined) updateData.opportunityId = opportunityId;
      if (clientId !== undefined) updateData.clientId = clientId;
      if (businessUnitId !== undefined) updateData.businessUnitId = businessUnitId;
      if (isReminder !== undefined) updateData.isReminder = isReminder;
      if (reminderDate !== undefined) updateData.reminderDate = reminderDate ? new Date(reminderDate) : null;
      if (category !== undefined) updateData.category = category;
      if (tags !== undefined) updateData.tags = tags;
      if (completionPercentage !== undefined) updateData.completionPercentage = completionPercentage;

      // Update task
      const task = await TaskController.taskService.updateTask(id, updateData);

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error(`Error in TaskController.updateTask for task ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: `Failed to update task with ID ${req.params.id}`,
        error: error.message
      });
    }
  }

  /**
   * Delete a task
   * @param req Express request object
   * @param res Express response object
   */
  public static async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Delete task
      const success = await TaskController.taskService.deleteTask(id);

      res.status(200).json({
        success: true,
        message: `Task with ID ${id} deleted successfully`
      });
    } catch (error) {
      console.error(`Error in TaskController.deleteTask for task ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: `Failed to delete task with ID ${req.params.id}`,
        error: error.message
      });
    }
  }

  /**
   * Get tasks assigned to the authenticated user
   * @param req Express request object
   * @param res Express response object
   */
  public static async getMyTasks(req: Request, res: Response): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = (req as any).userId;

      // Get tasks
      const tasks = await TaskController.taskService.getTasksAssignedToUser(userId);

      res.status(200).json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error(`Error in TaskController.getMyTasks for user ID ${(req as any).userId}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to get your tasks',
        error: error.message
      });
    }
  }

  /**
   * Get tasks for a client
   * @param req Express request object
   * @param res Express response object
   */
  public static async getTasksForClient(req: Request, res: Response): Promise<void> {
    try {
      const { clientId } = req.params;

      // Get tasks
      const tasks = await TaskController.taskService.getTasksForClient(clientId);

      res.status(200).json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error(`Error in TaskController.getTasksForClient for client ID ${req.params.clientId}:`, error);
      res.status(500).json({
        success: false,
        message: `Failed to get tasks for client with ID ${req.params.clientId}`,
        error: error.message
      });
    }
  }

  /**
   * Get tasks for an opportunity
   * @param req Express request object
   * @param res Express response object
   */
  public static async getTasksForOpportunity(req: Request, res: Response): Promise<void> {
    try {
      const { opportunityId } = req.params;

      // Get tasks
      const tasks = await TaskController.taskService.getTasksForOpportunity(opportunityId);

      res.status(200).json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error(`Error in TaskController.getTasksForOpportunity for opportunity ID ${req.params.opportunityId}:`, error);
      res.status(500).json({
        success: false,
        message: `Failed to get tasks for opportunity with ID ${req.params.opportunityId}`,
        error: error.message
      });
    }
  }

  /**
   * Get tasks for a business unit
   * @param req Express request object
   * @param res Express response object
   */
  public static async getTasksForBusinessUnit(req: Request, res: Response): Promise<void> {
    try {
      const { businessUnitId } = req.params;

      // Get tasks
      const tasks = await TaskController.taskService.getTasksForBusinessUnit(businessUnitId);

      res.status(200).json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error(`Error in TaskController.getTasksForBusinessUnit for business unit ID ${req.params.businessUnitId}:`, error);
      res.status(500).json({
        success: false,
        message: `Failed to get tasks for business unit with ID ${req.params.businessUnitId}`,
        error: error.message
      });
    }
  }

  /**
   * Get overdue tasks
   * @param req Express request object
   * @param res Express response object
   */
  public static async getOverdueTasks(req: Request, res: Response): Promise<void> {
    try {
      // Get tasks
      const tasks = await TaskController.taskService.getOverdueTasks();

      res.status(200).json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Error in TaskController.getOverdueTasks:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get overdue tasks',
        error: error.message
      });
    }
  }
}

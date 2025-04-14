import { getRepository, Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Task, TaskStatus, TaskPriority } from '../models/Task';
import { User } from '../models/User';

/**
 * Interface for task creation data
 */
interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date;
  assignedToId: string;
  createdById: string;
  opportunityId?: string;
  clientId?: string;
  businessUnitId?: string;
  isReminder?: boolean;
  reminderDate?: Date;
  category?: string;
  tags?: string[];
  completionPercentage?: number;
}

/**
 * Interface for task update data
 */
interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date;
  assignedToId?: string;
  opportunityId?: string;
  clientId?: string;
  businessUnitId?: string;
  isReminder?: boolean;
  reminderDate?: Date;
  category?: string;
  tags?: string[];
  completionPercentage?: number;
}

/**
 * Interface for task filter options
 */
interface TaskFilterOptions {
  status?: TaskStatus | TaskStatus[];
  priority?: TaskPriority | TaskPriority[];
  assignedToId?: string;
  createdById?: string;
  opportunityId?: string;
  clientId?: string;
  businessUnitId?: string;
  isReminder?: boolean;
  category?: string;
  dueDateStart?: Date;
  dueDateEnd?: Date;
  isOverdue?: boolean;
}

/**
 * Service class for handling Task related business logic
 */
export class TaskService {
  private taskRepository: Repository<Task>;
  private userRepository: Repository<User>;

  constructor() {
    this.taskRepository = getRepository(Task);
    this.userRepository = getRepository(User);
  }

  /**
   * Create a new task
   * @param data Task creation data
   * @returns Promise resolving to the created task
   */
  public async createTask(data: CreateTaskData): Promise<Task> {
    try {
      // Validate assigned user exists
      const assignedUser = await this.userRepository.findOne(data.assignedToId);
      if (!assignedUser) {
        throw new Error(`User with ID ${data.assignedToId} not found`);
      }

      // Validate created by user exists
      const createdByUser = await this.userRepository.findOne(data.createdById);
      if (!createdByUser) {
        throw new Error(`User with ID ${data.createdById} not found`);
      }

      // Create new task
      const task = this.taskRepository.create(data);
      
      // Save task
      return await this.taskRepository.save(task);
    } catch (error) {
      console.error('Error in TaskService.createTask:', error);
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  /**
   * Get all tasks with optional filtering
   * @param options Task filter options
   * @returns Promise resolving to an array of tasks
   */
  public async getTasks(options?: TaskFilterOptions): Promise<Task[]> {
    try {
      const queryBuilder = this.taskRepository.createQueryBuilder('task')
        .leftJoinAndSelect('task.assignedTo', 'assignedTo')
        .leftJoinAndSelect('task.createdBy', 'createdBy')
        .leftJoinAndSelect('task.opportunity', 'opportunity')
        .leftJoinAndSelect('task.client', 'client')
        .leftJoinAndSelect('task.businessUnit', 'businessUnit')
        .orderBy('task.createdAt', 'DESC');

      // Apply filters if provided
      if (options) {
        // Status filter
        if (options.status) {
          if (Array.isArray(options.status)) {
            queryBuilder.andWhere('task.status IN (:...statuses)', { statuses: options.status });
          } else {
            queryBuilder.andWhere('task.status = :status', { status: options.status });
          }
        }

        // Priority filter
        if (options.priority) {
          if (Array.isArray(options.priority)) {
            queryBuilder.andWhere('task.priority IN (:...priorities)', { priorities: options.priority });
          } else {
            queryBuilder.andWhere('task.priority = :priority', { priority: options.priority });
          }
        }

        // User filters
        if (options.assignedToId) {
          queryBuilder.andWhere('task.assignedToId = :assignedToId', { assignedToId: options.assignedToId });
        }

        if (options.createdById) {
          queryBuilder.andWhere('task.createdById = :createdById', { createdById: options.createdById });
        }

        // Related entity filters
        if (options.opportunityId) {
          queryBuilder.andWhere('task.opportunityId = :opportunityId', { opportunityId: options.opportunityId });
        }

        if (options.clientId) {
          queryBuilder.andWhere('task.clientId = :clientId', { clientId: options.clientId });
        }

        if (options.businessUnitId) {
          queryBuilder.andWhere('task.businessUnitId = :businessUnitId', { businessUnitId: options.businessUnitId });
        }

        // Reminder filter
        if (options.isReminder !== undefined) {
          queryBuilder.andWhere('task.isReminder = :isReminder', { isReminder: options.isReminder });
        }

        // Category filter
        if (options.category) {
          queryBuilder.andWhere('task.category = :category', { category: options.category });
        }

        // Due date filters
        if (options.dueDateStart && options.dueDateEnd) {
          queryBuilder.andWhere('task.dueDate BETWEEN :start AND :end', { 
            start: options.dueDateStart, 
            end: options.dueDateEnd 
          });
        } else if (options.dueDateStart) {
          queryBuilder.andWhere('task.dueDate >= :start', { start: options.dueDateStart });
        } else if (options.dueDateEnd) {
          queryBuilder.andWhere('task.dueDate <= :end', { end: options.dueDateEnd });
        }

        // Overdue filter
        if (options.isOverdue) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          queryBuilder.andWhere('task.dueDate <= :today', { today })
            .andWhere('task.status != :completedStatus', { completedStatus: TaskStatus.COMPLETED });
        }
      }

      return await queryBuilder.getMany();
    } catch (error) {
      console.error('Error in TaskService.getTasks:', error);
      throw new Error(`Failed to get tasks: ${error.message}`);
    }
  }

  /**
   * Get a task by ID
   * @param id Task ID
   * @returns Promise resolving to the task or null if not found
   */
  public async getTaskById(id: string): Promise<Task | null> {
    try {
      return await this.taskRepository.findOne(id, {
        relations: ['assignedTo', 'createdBy', 'opportunity', 'client', 'businessUnit']
      });
    } catch (error) {
      console.error(`Error in TaskService.getTaskById for task ID ${id}:`, error);
      throw new Error(`Failed to get task with ID ${id}: ${error.message}`);
    }
  }

  /**
   * Update a task
   * @param id Task ID
   * @param data Task update data
   * @returns Promise resolving to the updated task
   */
  public async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    try {
      // Get existing task
      const task = await this.taskRepository.findOne(id);
      if (!task) {
        throw new Error(`Task with ID ${id} not found`);
      }

      // Validate assigned user if provided
      if (data.assignedToId) {
        const assignedUser = await this.userRepository.findOne(data.assignedToId);
        if (!assignedUser) {
          throw new Error(`User with ID ${data.assignedToId} not found`);
        }
      }

      // Update task
      this.taskRepository.merge(task, data);
      
      // Save updated task
      return await this.taskRepository.save(task);
    } catch (error) {
      console.error(`Error in TaskService.updateTask for task ID ${id}:`, error);
      throw new Error(`Failed to update task with ID ${id}: ${error.message}`);
    }
  }

  /**
   * Delete a task
   * @param id Task ID
   * @returns Promise resolving to true if successful
   */
  public async deleteTask(id: string): Promise<boolean> {
    try {
      // Get existing task
      const task = await this.taskRepository.findOne(id);
      if (!task) {
        throw new Error(`Task with ID ${id} not found`);
      }

      // Delete task
      await this.taskRepository.remove(task);
      
      return true;
    } catch (error) {
      console.error(`Error in TaskService.deleteTask for task ID ${id}:`, error);
      throw new Error(`Failed to delete task with ID ${id}: ${error.message}`);
    }
  }

  /**
   * Get tasks assigned to a user
   * @param userId User ID
   * @returns Promise resolving to an array of tasks
   */
  public async getTasksAssignedToUser(userId: string): Promise<Task[]> {
    return this.getTasks({ assignedToId: userId });
  }

  /**
   * Get tasks for a client
   * @param clientId Client ID
   * @returns Promise resolving to an array of tasks
   */
  public async getTasksForClient(clientId: string): Promise<Task[]> {
    return this.getTasks({ clientId });
  }

  /**
   * Get tasks for an opportunity
   * @param opportunityId Opportunity ID
   * @returns Promise resolving to an array of tasks
   */
  public async getTasksForOpportunity(opportunityId: string): Promise<Task[]> {
    return this.getTasks({ opportunityId });
  }

  /**
   * Get tasks for a business unit
   * @param businessUnitId Business Unit ID
   * @returns Promise resolving to an array of tasks
   */
  public async getTasksForBusinessUnit(businessUnitId: string): Promise<Task[]> {
    return this.getTasks({ businessUnitId });
  }

  /**
   * Get overdue tasks
   * @returns Promise resolving to an array of overdue tasks
   */
  public async getOverdueTasks(): Promise<Task[]> {
    return this.getTasks({ isOverdue: true });
  }
}

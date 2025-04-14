import api from './config';
import { AxiosResponse } from 'axios';

// Define status enum
export enum TaskStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  OVERDUE = 'Overdue'
}

// Define priority enum
export enum TaskPriority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

// Define types
export interface Task {
  TaskID: string;
  Title: string;
  Description?: string;
  OpportunityID?: string;
  AssignedUserID: string;
  Status: TaskStatus;
  Priority: TaskPriority;
  DueDate: Date;
  CompletedDate?: Date;
  CreatedAt: Date;
  UpdatedAt: Date;
  Opportunity?: any;
  AssignedUser?: any;
}

export interface TaskFormData {
  Title: string;
  Description?: string;
  OpportunityID?: string;
  AssignedUserID: string;
  Status: TaskStatus;
  Priority: TaskPriority;
  DueDate: Date;
}

// Task API service
const taskService = {
  // Get all tasks
  getAll: async (): Promise<Task[]> => {
    const response: AxiosResponse<Task[]> = await api.get('/tasks');
    return response.data;
  },

  // Get tasks by status
  getByStatus: async (status: TaskStatus): Promise<Task[]> => {
    const response: AxiosResponse<Task[]> = await api.get(`/tasks?status=${status}`);
    return response.data;
  },

  // Get tasks by assigned user
  getByAssignedUser: async (userId: string): Promise<Task[]> => {
    const response: AxiosResponse<Task[]> = await api.get(`/tasks?assignedUser=${userId}`);
    return response.data;
  },

  // Get my tasks (current user)
  getMyTasks: async (): Promise<Task[]> => {
    const response: AxiosResponse<Task[]> = await api.get('/tasks/my-tasks');
    return response.data;
  },

  // Get overdue tasks
  getOverdueTasks: async (): Promise<Task[]> => {
    const response: AxiosResponse<Task[]> = await api.get('/tasks?status=Overdue');
    return response.data;
  },

  // Get tasks by opportunity
  getByOpportunity: async (opportunityId: string): Promise<Task[]> => {
    const response: AxiosResponse<Task[]> = await api.get(`/opportunities/${opportunityId}/tasks`);
    return response.data;
  },

  // Get task by ID
  getById: async (id: string): Promise<Task> => {
    const response: AxiosResponse<Task> = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  create: async (taskData: TaskFormData): Promise<Task> => {
    const response: AxiosResponse<Task> = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update task
  update: async (id: string, taskData: Partial<TaskFormData>): Promise<Task> => {
    const response: AxiosResponse<Task> = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Update task status
  updateStatus: async (id: string, status: TaskStatus): Promise<Task> => {
    const response: AxiosResponse<Task> = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  // Mark task as completed
  markAsCompleted: async (id: string): Promise<Task> => {
    const response: AxiosResponse<Task> = await api.patch(`/tasks/${id}/complete`, {});
    return response.data;
  },

  // Delete task
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  }
};

export default taskService;

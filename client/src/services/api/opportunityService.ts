import api from './config';
import { AxiosResponse } from 'axios';

// Define status enum
export enum OpportunityStatus {
  IDENTIFIED = 'Identified',
  IN_DISCUSSION = 'In Discussion',
  PROPOSAL_SENT = 'Proposal Sent',
  ON_HOLD = 'On Hold',
  WON = 'Won',
  LOST = 'Lost'
}

// Define priority enum
export enum OpportunityPriority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

// Define types
export interface Opportunity {
  OpportunityID: string;
  ClientID: string;
  ServiceID: string;
  AssignedUserID?: string;
  Status: OpportunityStatus;
  Priority: OpportunityPriority;
  Notes?: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  Client?: any;
  Service?: any;
  AssignedUser?: any;
  Tasks?: any[];
}

export interface OpportunityFormData {
  ClientID: string;
  ServiceID: string;
  AssignedUserID?: string;
  Status: OpportunityStatus;
  Priority: OpportunityPriority;
  Notes?: string;
}

// Opportunity API service
const opportunityService = {
  // Get all opportunities
  getAll: async (): Promise<Opportunity[]> => {
    const response: AxiosResponse<Opportunity[]> = await api.get('/opportunities');
    return response.data;
  },

  // Get opportunities by status
  getByStatus: async (status: OpportunityStatus): Promise<Opportunity[]> => {
    const response: AxiosResponse<Opportunity[]> = await api.get(`/opportunities?status=${status}`);
    return response.data;
  },

  // Get opportunities by assigned user
  getByAssignedUser: async (userId: string): Promise<Opportunity[]> => {
    const response: AxiosResponse<Opportunity[]> = await api.get(`/opportunities?assignedUser=${userId}`);
    return response.data;
  },

  // Get opportunities by client
  getByClient: async (clientId: string): Promise<Opportunity[]> => {
    const response: AxiosResponse<Opportunity[]> = await api.get(`/clients/${clientId}/opportunities`);
    return response.data;
  },

  // Get opportunities by service
  getByService: async (serviceId: string): Promise<Opportunity[]> => {
    const response: AxiosResponse<Opportunity[]> = await api.get(`/services/${serviceId}/opportunities`);
    return response.data;
  },

  // Get opportunities by business unit
  getByBusinessUnit: async (buId: string): Promise<Opportunity[]> => {
    const response: AxiosResponse<Opportunity[]> = await api.get(`/business-units/${buId}/opportunities`);
    return response.data;
  },

  // Get opportunity by ID
  getById: async (id: string): Promise<Opportunity> => {
    const response: AxiosResponse<Opportunity> = await api.get(`/opportunities/${id}`);
    return response.data;
  },

  // Create new opportunity
  create: async (opportunityData: OpportunityFormData): Promise<Opportunity> => {
    const response: AxiosResponse<Opportunity> = await api.post('/opportunities', opportunityData);
    return response.data;
  },

  // Update opportunity
  update: async (id: string, opportunityData: Partial<OpportunityFormData>): Promise<Opportunity> => {
    const response: AxiosResponse<Opportunity> = await api.put(`/opportunities/${id}`, opportunityData);
    return response.data;
  },

  // Update opportunity status
  updateStatus: async (id: string, status: OpportunityStatus): Promise<Opportunity> => {
    const response: AxiosResponse<Opportunity> = await api.patch(`/opportunities/${id}/status`, { status });
    return response.data;
  },

  // Delete opportunity
  delete: async (id: string): Promise<void> => {
    await api.delete(`/opportunities/${id}`);
  },

  // Get tasks for this opportunity
  getTasks: async (opportunityId: string): Promise<any[]> => {
    const response: AxiosResponse<any[]> = await api.get(`/opportunities/${opportunityId}/tasks`);
    return response.data;
  },

  // Add task to opportunity
  addTask: async (opportunityId: string, taskData: any): Promise<any> => {
    const response: AxiosResponse<any> = await api.post(`/opportunities/${opportunityId}/tasks`, taskData);
    return response.data;
  },

  // Add note to opportunity
  addNote: async (opportunityId: string, note: string): Promise<any> => {
    const response: AxiosResponse<any> = await api.post(`/opportunities/${opportunityId}/notes`, { content: note });
    return response.data;
  }
};

export default opportunityService;

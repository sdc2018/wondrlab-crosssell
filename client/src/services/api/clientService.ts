import api from './config';
import { AxiosResponse } from 'axios';

// Define types
export interface Client {
  ClientID: string;
  Name: string;
  Industry?: string;
  Region?: string;
  Address?: string;
  PrimaryAccountManagerUserID?: string;
  PrimaryBU_ID?: string;
  IsActive: boolean;
  PrimaryAccountManager?: any;
  PrimaryBusinessUnit?: any;
  Contacts?: any[];
  Engagements?: any[];
  Opportunities?: any[];
}

export interface ClientFormData {
  Name: string;
  Industry?: string;
  Region?: string;
  Address?: string;
  PrimaryAccountManagerUserID?: string;
  PrimaryBU_ID?: string;
}

// Client API service
const clientService = {
  // Get all clients
  getAll: async (): Promise<Client[]> => {
    const response: AxiosResponse<Client[]> = await api.get('/clients');
    return response.data;
  },

  // Get client by ID
  getById: async (id: string): Promise<Client> => {
    const response: AxiosResponse<Client> = await api.get(`/clients/${id}`);
    return response.data;
  },

  // Create new client
  create: async (clientData: ClientFormData): Promise<Client> => {
    const response: AxiosResponse<Client> = await api.post('/clients', clientData);
    return response.data;
  },

  // Update client
  update: async (id: string, clientData: ClientFormData): Promise<Client> => {
    const response: AxiosResponse<Client> = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },

  // Delete client (soft delete by setting IsActive to false)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },

  // Get client contacts
  getContacts: async (clientId: string): Promise<any[]> => {
    const response: AxiosResponse<any[]> = await api.get(`/clients/${clientId}/contacts`);
    return response.data;
  },

  // Get client opportunities
  getOpportunities: async (clientId: string): Promise<any[]> => {
    const response: AxiosResponse<any[]> = await api.get(`/clients/${clientId}/opportunities`);
    return response.data;
  },

  // Get client engagements
  getEngagements: async (clientId: string): Promise<any[]> => {
    const response: AxiosResponse<any[]> = await api.get(`/clients/${clientId}/engagements`);
    return response.data;
  }
};

export default clientService;

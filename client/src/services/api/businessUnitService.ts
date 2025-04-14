import api from './config';
import { AxiosResponse } from 'axios';

// Define types
export interface BusinessUnit {
  BU_ID: string;
  Name: string;
  Description?: string;
  LeadUserID?: string;
  IsActive: boolean;
  LeadUser?: any;
  Services?: any[];
  Users?: any[];
}

export interface BusinessUnitFormData {
  Name: string;
  Description?: string;
  LeadUserID?: string;
}

// BusinessUnit API service
const businessUnitService = {
  // Get all business units
  getAll: async (): Promise<BusinessUnit[]> => {
    const response: AxiosResponse<BusinessUnit[]> = await api.get('/business-units');
    return response.data;
  },

  // Get business unit by ID
  getById: async (id: string): Promise<BusinessUnit> => {
    const response: AxiosResponse<BusinessUnit> = await api.get(`/business-units/${id}`);
    return response.data;
  },

  // Create new business unit
  create: async (buData: BusinessUnitFormData): Promise<BusinessUnit> => {
    const response: AxiosResponse<BusinessUnit> = await api.post('/business-units', buData);
    return response.data;
  },

  // Update business unit
  update: async (id: string, buData: BusinessUnitFormData): Promise<BusinessUnit> => {
    const response: AxiosResponse<BusinessUnit> = await api.put(`/business-units/${id}`, buData);
    return response.data;
  },

  // Delete business unit (soft delete by setting IsActive to false)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/business-units/${id}`);
  },

  // Get services for this business unit
  getServices: async (buId: string): Promise<any[]> => {
    const response: AxiosResponse<any[]> = await api.get(`/business-units/${buId}/services`);
    return response.data;
  },

  // Get users for this business unit
  getUsers: async (buId: string): Promise<any[]> => {
    const response: AxiosResponse<any[]> = await api.get(`/business-units/${buId}/users`);
    return response.data;
  },

  // Get clients primarily associated with this business unit
  getClients: async (buId: string): Promise<any[]> => {
    const response: AxiosResponse<any[]> = await api.get(`/business-units/${buId}/clients`);
    return response.data;
  }
};

export default businessUnitService;

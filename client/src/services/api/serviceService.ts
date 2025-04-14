import api from './config';
import { AxiosResponse } from 'axios';

// Define types
export interface Service {
  ServiceID: string;
  Name: string;
  Description?: string;
  AssociatedBU_ID: string;
  IsActive: boolean;
  BusinessUnit?: any;
}

export interface ServiceFormData {
  Name: string;
  Description?: string;
  AssociatedBU_ID: string;
}

// Service API service
const serviceService = {
  // Get all services
  getAll: async (): Promise<Service[]> => {
    const response: AxiosResponse<Service[]> = await api.get('/services');
    return response.data;
  },

  // Get services by business unit
  getByBusinessUnit: async (buId: string): Promise<Service[]> => {
    const response: AxiosResponse<Service[]> = await api.get(`/business-units/${buId}/services`);
    return response.data;
  },

  // Get service by ID
  getById: async (id: string): Promise<Service> => {
    const response: AxiosResponse<Service> = await api.get(`/services/${id}`);
    return response.data;
  },

  // Create new service
  create: async (serviceData: ServiceFormData): Promise<Service> => {
    const response: AxiosResponse<Service> = await api.post('/services', serviceData);
    return response.data;
  },

  // Update service
  update: async (id: string, serviceData: ServiceFormData): Promise<Service> => {
    const response: AxiosResponse<Service> = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },

  // Delete service (soft delete by setting IsActive to false)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/services/${id}`);
  },

  // Get clients using this service
  getClients: async (serviceId: string): Promise<any[]> => {
    const response: AxiosResponse<any[]> = await api.get(`/services/${serviceId}/clients`);
    return response.data;
  },

  // Get opportunities for this service
  getOpportunities: async (serviceId: string): Promise<any[]> => {
    const response: AxiosResponse<any[]> = await api.get(`/services/${serviceId}/opportunities`);
    return response.data;
  }
};

export default serviceService;

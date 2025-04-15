// API service for cross-sell matrix functionality
import axios from 'axios';

// Define types for the API responses
export interface Client {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface Opportunity {
  id: string;
  clientId: string;
  serviceId: string;
  status: string;
  priority: string;
  assignedUserId: string;
  estimatedValue: number;
  createdAt: string;
  updatedAt: string;
}

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all clients
export const getClients = async (): Promise<Client[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clients`);
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
};

// Get all services
export const getServices = async (): Promise<Service[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/services`);
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

// Get all opportunities
export const getOpportunities = async (): Promise<Opportunity[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/opportunities`);
    return response.data;
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return [];
  }
};

// Get opportunity by ID
export const getOpportunityById = async (id: string): Promise<Opportunity | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/opportunities/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching opportunity ${id}:`, error);
    return null;
  }
};

// Create a new opportunity
export const createOpportunity = async (opportunity: Omit<Opportunity, 'id'>): Promise<Opportunity | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/opportunities`, opportunity);
    return response.data;
  } catch (error) {
    console.error('Error creating opportunity:', error);
    return null;
  }
};

// Update an existing opportunity
export const updateOpportunity = async (id: string, opportunity: Partial<Opportunity>): Promise<Opportunity | null> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/opportunities/${id}`, opportunity);
    return response.data;
  } catch (error) {
    console.error(`Error updating opportunity ${id}:`, error);
    return null;
  }
};

// Delete an opportunity
export const deleteOpportunity = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE_URL}/opportunities/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting opportunity ${id}:`, error);
    return false;
  }
};

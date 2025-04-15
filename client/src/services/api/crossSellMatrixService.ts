import api from './config';
import { AxiosResponse } from 'axios';

// Define types
export interface CrossSellOpportunity {
  id: string;
  clientId: string;
  clientName: string;
  businessUnitId: string;
  businessUnitName: string;
  serviceId: string;
  serviceName: string;
  score: number;
  potentialValue: number;
  createdAt: Date;
  updatedAt: Date;
  client?: any;
  businessUnit?: any;
  service?: any;
}

export interface CrossSellMatrix {
  opportunities: CrossSellOpportunity[];
  totalPotentialValue: number;
  highValueOpportunities: CrossSellOpportunity[];
  averageScore: number;
}

export interface CrossSellFilter {
  clientId?: string;
  businessUnitId?: string;
  minScore?: number;
  maxScore?: number;
  minPotentialValue?: number;
  maxPotentialValue?: number;
  industry?: string;
  region?: string;
}

// Cross-Sell Matrix API service
const crossSellMatrixService = {
  // Get cross-sell matrix
  getMatrix: async (filter?: CrossSellFilter): Promise<CrossSellMatrix> => {
    let url = '/cross-sell-matrix';
    
    // Add query parameters if filter is provided
    if (filter) {
      const params = new URLSearchParams();
      
      if (filter.clientId) {
        params.append('clientId', filter.clientId);
      }
      
      if (filter.businessUnitId) {
        params.append('businessUnitId', filter.businessUnitId);
      }
      
      if (filter.minScore !== undefined) {
        params.append('minScore', filter.minScore.toString());
      }
      
      if (filter.maxScore !== undefined) {
        params.append('maxScore', filter.maxScore.toString());
      }
      
      if (filter.minPotentialValue !== undefined) {
        params.append('minPotentialValue', filter.minPotentialValue.toString());
      }
      
      if (filter.maxPotentialValue !== undefined) {
        params.append('maxPotentialValue', filter.maxPotentialValue.toString());
      }
      
      if (filter.industry) {
        params.append('industry', filter.industry);
      }
      
      if (filter.region) {
        params.append('region', filter.region);
      }
      
      // Add query string to URL if there are any parameters
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    const response: AxiosResponse<CrossSellMatrix> = await api.get(url);
    return response.data;
  },

  // Get cross-sell opportunities by client
  getOpportunitiesByClient: async (clientId: string): Promise<CrossSellOpportunity[]> => {
    const response: AxiosResponse<CrossSellOpportunity[]> = await api.get(`/cross-sell-matrix/client/${clientId}`);
    return response.data;
  },

  // Get cross-sell opportunities by business unit
  getOpportunitiesByBusinessUnit: async (businessUnitId: string): Promise<CrossSellOpportunity[]> => {
    const response: AxiosResponse<CrossSellOpportunity[]> = await api.get(`/cross-sell-matrix/business-unit/${businessUnitId}`);
    return response.data;
  },

  // Get high-value cross-sell opportunities
  getHighValueOpportunities: async (threshold?: number): Promise<CrossSellOpportunity[]> => {
    let url = '/cross-sell-matrix/high-value';
    
    if (threshold !== undefined) {
      url += `?threshold=${threshold}`;
    }
    
    const response: AxiosResponse<CrossSellOpportunity[]> = await api.get(url);
    return response.data;
  },

  // Get cross-sell opportunities by industry
  getOpportunitiesByIndustry: async (industry: string): Promise<CrossSellOpportunity[]> => {
    const response: AxiosResponse<CrossSellOpportunity[]> = await api.get(`/cross-sell-matrix/industry/${industry}`);
    return response.data;
  },

  // Get cross-sell opportunities by region
  getOpportunitiesByRegion: async (region: string): Promise<CrossSellOpportunity[]> => {
    const response: AxiosResponse<CrossSellOpportunity[]> = await api.get(`/cross-sell-matrix/region/${region}`);
    return response.data;
  },

  // Create opportunity from cross-sell suggestion
  createOpportunityFromSuggestion: async (crossSellOpportunityId: string, opportunityData: any): Promise<any> => {
    const response: AxiosResponse<any> = await api.post(`/cross-sell-matrix/${crossSellOpportunityId}/create-opportunity`, opportunityData);
    return response.data;
  },

  // Refresh cross-sell matrix data
  refreshMatrix: async (): Promise<CrossSellMatrix> => {
    const response: AxiosResponse<CrossSellMatrix> = await api.post('/cross-sell-matrix/refresh');
    return response.data;
  }
};

export default crossSellMatrixService;

/**
 * Import/Export utilities for Services
 */
import { Service } from '../../data/sampleData';
import {
  convertToCSV,
  parseCSV,
  convertToJSON,
  parseJSON,
  downloadCSV,
  downloadJSON,
  handleFileUpload
} from './baseUtils';

// Service CSV headers
const SERVICE_HEADERS = ['ServiceID', 'Name', 'Description', 'AssociatedBU_ID', 'IsActive', 'CreatedAt', 'UpdatedAt'];

// Function to convert a Service to CSV row data
const getServiceRowData = (service: Service): string[] => {
  return [
    service.ServiceID,
    service.Name,
    service.Description,
    service.AssociatedBU_ID,
    service.IsActive.toString(),
    service.CreatedAt.toISOString(),
    service.UpdatedAt.toISOString()
  ];
};

// Function to create a Service from CSV row data
const createServiceFromCSV = (rowData: Record<string, string>): Service => {
  return {
    ServiceID: rowData.ServiceID,
    Name: rowData.Name,
    Description: rowData.Description,
    AssociatedBU_ID: rowData.AssociatedBU_ID,
    IsActive: rowData.IsActive.toLowerCase() === 'true',
    CreatedAt: new Date(rowData.CreatedAt),
    UpdatedAt: new Date(rowData.UpdatedAt)
  };
};

// Export Services to CSV
export const exportServicesToCSV = (services: Service[], filename: string = 'services.csv'): void => {
  downloadCSV(services, SERVICE_HEADERS, getServiceRowData, filename);
};

// Export Services to JSON
export const exportServicesToJSON = (services: Service[], filename: string = 'services.json'): void => {
  downloadJSON(services, filename);
};

// Import Services from CSV
export const importServicesFromCSV = (csvData: string): Service[] => {
  return parseCSV(csvData, SERVICE_HEADERS, createServiceFromCSV);
};

// Import Services from JSON
export const importServicesFromJSON = (jsonData: string): Service[] => {
  return parseJSON<Service>(jsonData);
};

// Handle Service file upload
export const handleServiceFileUpload = (
  file: File,
  onCSVLoad: (services: Service[]) => void,
  onJSONLoad: (services: Service[]) => void
): void => {
  handleFileUpload(file, (content) => {
    if (file.name.endsWith('.csv')) {
      const services = importServicesFromCSV(content);
      onCSVLoad(services);
    } else if (file.name.endsWith('.json')) {
      const services = importServicesFromJSON(content);
      onJSONLoad(services);
    }
  });
};

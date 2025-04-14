/**
 * Import/Export utilities for Clients
 */
import { Client } from '../../data/sampleData';
import {
  convertToCSV,
  parseCSV,
  convertToJSON,
  parseJSON,
  downloadCSV,
  downloadJSON,
  handleFileUpload
} from './baseUtils';

// Client CSV headers
const CLIENT_HEADERS = [
  'ClientID', 
  'Name', 
  'Industry', 
  'Region', 
  'Address', 
  'PrimaryAccountManagerUserID', 
  'PrimaryBU_ID', 
  'CreatedAt', 
  'UpdatedAt', 
  'IsActive'
];

// Function to convert a Client to CSV row data
const getClientRowData = (client: Client): string[] => {
  return [
    client.ClientID,
    client.Name,
    client.Industry,
    client.Region,
    client.Address,
    client.PrimaryAccountManagerUserID,
    client.PrimaryBU_ID,
    client.CreatedAt.toISOString(),
    client.UpdatedAt.toISOString(),
    client.IsActive.toString()
  ];
};

// Function to create a Client from CSV row data
const createClientFromCSV = (rowData: Record<string, string>): Client => {
  return {
    ClientID: rowData.ClientID,
    Name: rowData.Name,
    Industry: rowData.Industry,
    Region: rowData.Region,
    Address: rowData.Address,
    PrimaryAccountManagerUserID: rowData.PrimaryAccountManagerUserID,
    PrimaryBU_ID: rowData.PrimaryBU_ID,
    CreatedAt: new Date(rowData.CreatedAt),
    UpdatedAt: new Date(rowData.UpdatedAt),
    IsActive: rowData.IsActive.toLowerCase() === 'true'
  };
};

// Export Clients to CSV
export const exportClientsToCSV = (clients: Client[], filename: string = 'clients.csv'): void => {
  downloadCSV(clients, CLIENT_HEADERS, getClientRowData, filename);
};

// Export Clients to JSON
export const exportClientsToJSON = (clients: Client[], filename: string = 'clients.json'): void => {
  downloadJSON(clients, filename);
};

// Import Clients from CSV
export const importClientsFromCSV = (csvData: string): Client[] => {
  return parseCSV(csvData, CLIENT_HEADERS, createClientFromCSV);
};

// Import Clients from JSON
export const importClientsFromJSON = (jsonData: string): Client[] => {
  return parseJSON<Client>(jsonData);
};

// Handle Client file upload
export const handleClientFileUpload = (
  file: File,
  onCSVLoad: (clients: Client[]) => void,
  onJSONLoad: (clients: Client[]) => void
): void => {
  handleFileUpload(file, (content) => {
    if (file.name.endsWith('.csv')) {
      const clients = importClientsFromCSV(content);
      onCSVLoad(clients);
    } else if (file.name.endsWith('.json')) {
      const clients = importClientsFromJSON(content);
      onJSONLoad(clients);
    }
  });
};

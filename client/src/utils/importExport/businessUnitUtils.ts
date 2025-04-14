/**
 * Import/Export utilities for Business Units
 */
import { BusinessUnit } from '../../data/sampleData';
import {
  convertToCSV,
  parseCSV,
  convertToJSON,
  parseJSON,
  downloadCSV,
  downloadJSON,
  handleFileUpload
} from './baseUtils';

// Business Unit CSV headers
const BUSINESS_UNIT_HEADERS = ['BU_ID', 'Name', 'Description', 'HeadUserID', 'CreatedAt', 'UpdatedAt'];

// Function to convert a Business Unit to CSV row data
const getBusinessUnitRowData = (businessUnit: BusinessUnit): string[] => {
  return [
    businessUnit.BU_ID,
    businessUnit.Name,
    businessUnit.Description,
    businessUnit.HeadUserID || '',
    businessUnit.CreatedAt.toISOString(),
    businessUnit.UpdatedAt.toISOString()
  ];
};

// Function to create a Business Unit from CSV row data
const createBusinessUnitFromCSV = (rowData: Record<string, string>): BusinessUnit => {
  return {
    BU_ID: rowData.BU_ID,
    Name: rowData.Name,
    Description: rowData.Description,
    HeadUserID: rowData.HeadUserID || undefined,
    CreatedAt: new Date(rowData.CreatedAt),
    UpdatedAt: new Date(rowData.UpdatedAt)
  };
};

// Export Business Units to CSV
export const exportBusinessUnitsToCSV = (businessUnits: BusinessUnit[], filename: string = 'business-units.csv'): void => {
  downloadCSV(businessUnits, BUSINESS_UNIT_HEADERS, getBusinessUnitRowData, filename);
};

// Export Business Units to JSON
export const exportBusinessUnitsToJSON = (businessUnits: BusinessUnit[], filename: string = 'business-units.json'): void => {
  downloadJSON(businessUnits, filename);
};

// Import Business Units from CSV
export const importBusinessUnitsFromCSV = (csvData: string): BusinessUnit[] => {
  return parseCSV(csvData, BUSINESS_UNIT_HEADERS, createBusinessUnitFromCSV);
};

// Import Business Units from JSON
export const importBusinessUnitsFromJSON = (jsonData: string): BusinessUnit[] => {
  return parseJSON<BusinessUnit>(jsonData);
};

// Handle Business Unit file upload
export const handleBusinessUnitFileUpload = (
  file: File,
  onCSVLoad: (businessUnits: BusinessUnit[]) => void,
  onJSONLoad: (businessUnits: BusinessUnit[]) => void
): void => {
  handleFileUpload(file, (content) => {
    if (file.name.endsWith('.csv')) {
      const businessUnits = importBusinessUnitsFromCSV(content);
      onCSVLoad(businessUnits);
    } else if (file.name.endsWith('.json')) {
      const businessUnits = importBusinessUnitsFromJSON(content);
      onJSONLoad(businessUnits);
    }
  });
};

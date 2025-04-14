/**
 * Import/Export utilities for Opportunities
 */
import { Opportunity, OpportunityStatus, OpportunityPriority } from '../../data/sampleData';
import {
  convertToCSV,
  parseCSV,
  convertToJSON,
  parseJSON,
  downloadCSV,
  downloadJSON,
  handleFileUpload
} from './baseUtils';

// Opportunity CSV headers
const OPPORTUNITY_HEADERS = [
  'OpportunityID',
  'ClientID',
  'ServiceID',
  'Status',
  'Priority',
  'AssignedUserID',
  'EstimatedValue',
  'Notes',
  'CreatedAt',
  'UpdatedAt'
];

// Function to convert an Opportunity to CSV row data
const getOpportunityRowData = (opportunity: Opportunity): string[] => {
  return [
    opportunity.OpportunityID,
    opportunity.ClientID,
    opportunity.ServiceID,
    opportunity.Status,
    opportunity.Priority,
    opportunity.AssignedUserID,
    opportunity.EstimatedValue?.toString() || '',
    opportunity.Notes || '',
    opportunity.CreatedAt.toISOString(),
    opportunity.UpdatedAt.toISOString()
  ];
};

// Function to create an Opportunity from CSV row data
const createOpportunityFromCSV = (rowData: Record<string, string>): Opportunity => {
  return {
    OpportunityID: rowData.OpportunityID,
    ClientID: rowData.ClientID,
    ServiceID: rowData.ServiceID,
    Status: rowData.Status as OpportunityStatus,
    Priority: rowData.Priority as OpportunityPriority,
    AssignedUserID: rowData.AssignedUserID,
    EstimatedValue: rowData.EstimatedValue ? parseFloat(rowData.EstimatedValue) : undefined,
    Notes: rowData.Notes || undefined,
    CreatedAt: new Date(rowData.CreatedAt),
    UpdatedAt: new Date(rowData.UpdatedAt)
  };
};

// Export Opportunities to CSV
export const exportOpportunitiesToCSV = (opportunities: Opportunity[], filename: string = 'opportunities.csv'): void => {
  downloadCSV(opportunities, OPPORTUNITY_HEADERS, getOpportunityRowData, filename);
};

// Export Opportunities to JSON
export const exportOpportunitiesToJSON = (opportunities: Opportunity[], filename: string = 'opportunities.json'): void => {
  downloadJSON(opportunities, filename);
};

// Import Opportunities from CSV
export const importOpportunitiesFromCSV = (csvData: string): Opportunity[] => {
  return parseCSV(csvData, OPPORTUNITY_HEADERS, createOpportunityFromCSV);
};

// Import Opportunities from JSON
export const importOpportunitiesFromJSON = (jsonData: string): Opportunity[] => {
  return parseJSON<Opportunity>(jsonData);
};

// Handle Opportunity file upload
export const handleOpportunityFileUpload = (
  file: File,
  onCSVLoad: (opportunities: Opportunity[]) => void,
  onJSONLoad: (opportunities: Opportunity[]) => void
): void => {
  handleFileUpload(file, (content) => {
    if (file.name.endsWith('.csv')) {
      const opportunities = importOpportunitiesFromCSV(content);
      onCSVLoad(opportunities);
    } else if (file.name.endsWith('.json')) {
      const opportunities = importOpportunitiesFromJSON(content);
      onJSONLoad(opportunities);
    }
  });
};

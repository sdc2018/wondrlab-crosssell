import { sampleClients } from './sampleClients';
import { sampleServices } from './sampleServices';
import { sampleUsers } from './sampleUsers';
import { opportunitiesData } from './sampleOpportunitiesData';
import { opportunitiesData2 } from './sampleOpportunitiesData2';

export enum OpportunityStatus {
  IDENTIFIED = "Identified",
  IN_DISCUSSION = "In Discussion",
  PROPOSAL_SENT = "Proposal Sent",
  ON_HOLD = "On Hold",
  WON = "Won",
  LOST = "Lost"
}

export enum OpportunityPriority {
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low"
}

export interface Opportunity {
  OpportunityID: string;
  ClientID: string; // Reference to Client
  ServiceID: string; // Reference to Service
  Status: OpportunityStatus;
  Priority: OpportunityPriority;
  AssignedUserID: string; // Reference to User
  EstimatedValue?: number;
  Notes?: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export const sampleOpportunities: Opportunity[] = [...opportunitiesData, ...opportunitiesData2];

// Export function to get an opportunity by ID
export const getOpportunityById = (id: string): Opportunity | undefined => {
  return sampleOpportunities.find(opp => opp.OpportunityID === id);
};

// Export function to get all opportunities
export const getAllOpportunities = (): Opportunity[] => {
  return [...sampleOpportunities];
};

// Export function to get opportunities by status
export const getOpportunitiesByStatus = (status: OpportunityStatus): Opportunity[] => {
  return sampleOpportunities.filter(opp => opp.Status === status);
};

// Export function to get opportunities by client
export const getOpportunitiesByClient = (clientId: string): Opportunity[] => {
  return sampleOpportunities.filter(opp => opp.ClientID === clientId);
};

// Export function to get opportunities by service
export const getOpportunitiesByService = (serviceId: string): Opportunity[] => {
  return sampleOpportunities.filter(opp => opp.ServiceID === serviceId);
};

// Export function to get opportunities by assigned user
export const getOpportunitiesByUser = (userId: string): Opportunity[] => {
  return sampleOpportunities.filter(opp => opp.AssignedUserID === userId);
};

// Export function to get opportunities by priority
export const getOpportunitiesByPriority = (priority: OpportunityPriority): Opportunity[] => {
  return sampleOpportunities.filter(opp => opp.Priority === priority);
};

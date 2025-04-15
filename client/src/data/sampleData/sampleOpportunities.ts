import { sampleClients } from './sampleClients';
import { sampleServices } from './sampleServices';
import { sampleUsers } from './sampleUsers';

// Enums
export enum OpportunityStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  QUALIFIED = 'Qualified',
  PROPOSAL = 'Proposal',
  NEGOTIATION = 'Negotiation',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost'
}

export enum OpportunityPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

// Types
export interface Opportunity {
  id: string;
  title: string;
  description: string;
  clientId: string;
  serviceId: string;
  status: OpportunityStatus;
  priority: OpportunityPriority;
  value: number;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

// Sample data
export const sampleOpportunities: Opportunity[] = [
  {
    id: 'opp-001',
    title: 'Website Redesign for Client A',
    description: 'Complete website redesign with new branding elements',
    clientId: sampleClients[0].id,
    serviceId: sampleServices[0].id,
    status: OpportunityStatus.IN_PROGRESS,
    priority: OpportunityPriority.HIGH,
    value: 75000,
    assignedTo: sampleUsers[0].id,
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-01-20T14:45:00Z'
  },
  {
    id: 'opp-002',
    title: 'Social Media Campaign for Client B',
    description: 'Three-month social media campaign across multiple platforms',
    clientId: sampleClients[1].id,
    serviceId: sampleServices[1].id,
    status: OpportunityStatus.PROPOSAL,
    priority: OpportunityPriority.MEDIUM,
    value: 45000,
    assignedTo: sampleUsers[1].id,
    createdAt: '2023-02-05T09:15:00Z',
    updatedAt: '2023-02-10T11:30:00Z'
  },
  {
    id: 'opp-003',
    title: 'SEO Optimization for Client C',
    description: 'Comprehensive SEO audit and optimization',
    clientId: sampleClients[2].id,
    serviceId: sampleServices[2].id,
    status: OpportunityStatus.CLOSED_WON,
    priority: OpportunityPriority.MEDIUM,
    value: 30000,
    assignedTo: sampleUsers[2].id,
    createdAt: '2023-01-25T13:45:00Z',
    updatedAt: '2023-02-15T16:20:00Z',
    closedAt: '2023-02-15T16:20:00Z'
  },
  {
    id: 'opp-004',
    title: 'Brand Strategy for Client D',
    description: 'Develop comprehensive brand strategy and guidelines',
    clientId: sampleClients[3].id,
    serviceId: sampleServices[3].id,
    status: OpportunityStatus.NEW,
    priority: OpportunityPriority.HIGH,
    value: 90000,
    assignedTo: sampleUsers[0].id,
    createdAt: '2023-03-01T10:00:00Z',
    updatedAt: '2023-03-01T10:00:00Z'
  },
  {
    id: 'opp-005',
    title: 'Content Marketing for Client E',
    description: 'Six-month content marketing campaign',
    clientId: sampleClients[4].id,
    serviceId: sampleServices[4].id,
    status: OpportunityStatus.QUALIFIED,
    priority: OpportunityPriority.LOW,
    value: 25000,
    assignedTo: sampleUsers[1].id,
    createdAt: '2023-02-20T14:30:00Z',
    updatedAt: '2023-02-25T09:45:00Z'
  }
];

// Utility functions
export const getOpportunityById = (id: string): Opportunity | undefined => {
  return sampleOpportunities.find(opportunity => opportunity.id === id);
};

export const getAllOpportunities = (): Opportunity[] => {
  return sampleOpportunities;
};

export const getOpportunitiesByStatus = (status: OpportunityStatus): Opportunity[] => {
  return sampleOpportunities.filter(opportunity => opportunity.status === status);
};

export const getOpportunitiesByClient = (clientId: string): Opportunity[] => {
  return sampleOpportunities.filter(opportunity => opportunity.clientId === clientId);
};

export const getOpportunitiesByService = (serviceId: string): Opportunity[] => {
  return sampleOpportunities.filter(opportunity => opportunity.serviceId === serviceId);
};

export const getOpportunitiesByUser = (userId: string): Opportunity[] => {
  return sampleOpportunities.filter(opportunity => opportunity.assignedTo === userId);
};

export const getOpportunitiesByPriority = (priority: OpportunityPriority): Opportunity[] => {
  return sampleOpportunities.filter(opportunity => opportunity.priority === priority);
};
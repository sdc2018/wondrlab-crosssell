// Export all sample data and utility functions from a single location

// Business Units
export type { BusinessUnit } from './sampleBusinessUnits';
export { 
  sampleBusinessUnits, 
  getBusinessUnitById, 
  getAllBusinessUnits 
} from './sampleBusinessUnits';

// Users
export type { User } from './sampleUsers';
export { 
  UserRole, 
  sampleUsers, 
  getUserById, 
  getAllUsers, 
  getUsersByRole, 
  getUsersByBusinessUnit 
} from './sampleUsers';

// Services
export type { Service } from './sampleServices';
export { 
  sampleServices, 
  getServiceById, 
  getAllServices, 
  getServicesByBusinessUnit, 
  getActiveServices 
} from './sampleServices';

// Clients
export type { Client } from './sampleClients';
export { 
  sampleClients, 
  getClientById, 
  getAllClients, 
  getClientsByIndustry, 
  getClientsByRegion, 
  getClientsByAccountManager, 
  getClientsByBusinessUnit 
} from './sampleClients';

// Opportunities
export type { Opportunity } from './sampleOpportunities';
export { 
  OpportunityStatus, 
  OpportunityPriority, 
  sampleOpportunities, 
  getOpportunityById, 
  getAllOpportunities, 
  getOpportunitiesByStatus, 
  getOpportunitiesByClient, 
  getOpportunitiesByService, 
  getOpportunitiesByUser, 
  getOpportunitiesByPriority 
} from './sampleOpportunities';
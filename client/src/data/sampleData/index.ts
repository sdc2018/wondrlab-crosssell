// Export all sample data and utility functions from a single location

// Business Units
export { 
  BusinessUnit, 
  sampleBusinessUnits, 
  getBusinessUnitById, 
  getAllBusinessUnits 
} from './sampleBusinessUnits';

// Users
export { 
  User, 
  UserRole, 
  sampleUsers, 
  getUserById, 
  getAllUsers, 
  getUsersByRole, 
  getUsersByBusinessUnit 
} from './sampleUsers';

// Services
export { 
  Service, 
  sampleServices, 
  getServiceById, 
  getAllServices, 
  getServicesByBusinessUnit, 
  getActiveServices 
} from './sampleServices';

// Clients
export { 
  Client, 
  sampleClients, 
  getClientById, 
  getAllClients, 
  getClientsByIndustry, 
  getClientsByRegion, 
  getClientsByAccountManager, 
  getClientsByBusinessUnit 
} from './sampleClients';

// Opportunities
export { 
  Opportunity, 
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

import { OpportunityStatus, OpportunityPriority } from '../../types';

// Define the Opportunity interface locally to avoid circular dependencies
interface Opportunity {
  OpportunityID: string;
  ClientID: string;
  ServiceID: string;
  Status: OpportunityStatus;
  Priority: OpportunityPriority;
  AssignedUserID: string;
  EstimatedValue?: number;
  Notes?: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export const opportunitiesData2: Opportunity[] = [
  // In Progress Opportunities
  {
    OpportunityID: "O003",
    ClientID: "C002", // Horizon Financial Services
    ServiceID: "S005", // Email Marketing
    Status: OpportunityStatus.IN_PROGRESS,
    Priority: OpportunityPriority.HIGH,
    AssignedUserID: "U003", // Priya Sharma
    EstimatedValue: 75000,
    Notes: "Newsletter campaign for Q3",
    CreatedAt: new Date("2023-06-01"),
    UpdatedAt: new Date("2023-06-10")
  },
  {
    OpportunityID: "O004",
    ClientID: "C004", // EcoTech Innovations
    ServiceID: "S010", // Video Production
    Status: OpportunityStatus.IN_PROGRESS,
    Priority: OpportunityPriority.HIGH,
    AssignedUserID: "U005", // Neha Patel
    EstimatedValue: 180000,
    Notes: "Product launch video series",
    CreatedAt: new Date("2023-06-05"),
    UpdatedAt: new Date("2023-06-15")
  },
  
  // Open Opportunities
  {
    OpportunityID: "O005",
    ClientID: "C005", // MetroHealth Hospital
    ServiceID: "S007", // SEO Services
    Status: OpportunityStatus.OPEN,
    Priority: OpportunityPriority.MEDIUM,
    AssignedUserID: "U007", // Vikram Singh
    EstimatedValue: 60000,
    Notes: "Website SEO optimization",
    CreatedAt: new Date("2023-06-10"),
    UpdatedAt: new Date("2023-06-10")
  }
]
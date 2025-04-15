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

export const opportunitiesData: Opportunity[] = [
  // Won Opportunities
  {
    OpportunityID: "O001",
    ClientID: "C001", // TechNova Solutions
    ServiceID: "S018", // Web Development
    Status: OpportunityStatus.WON,
    Priority: OpportunityPriority.HIGH,
    AssignedUserID: "U008", // Arjun Mehta
    EstimatedValue: 250000,
    Notes: "Corporate website redesign project",
    CreatedAt: new Date("2023-05-01"),
    UpdatedAt: new Date("2023-05-15")
  },
  {
    OpportunityID: "O002",
    ClientID: "C003", // PureLife Consumer Goods
    ServiceID: "S002", // Social Media Content
    Status: OpportunityStatus.WON,
    Priority: OpportunityPriority.MEDIUM,
    AssignedUserID: "U010", // Rajiv Kumar
    EstimatedValue: 120000,
    Notes: "6-month social media content calendar",
    CreatedAt: new Date("2023-05-05"),
    UpdatedAt: new Date("2023-05-20")
  }
]
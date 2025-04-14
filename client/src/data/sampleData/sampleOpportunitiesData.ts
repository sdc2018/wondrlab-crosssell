import { OpportunityStatus, OpportunityPriority, Opportunity } from './sampleOpportunities';

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
  },
  {
    OpportunityID: "O003",
    ClientID: "C005", // SpeedStar Motors
    ServiceID: "S007", // Video Production
    Status: OpportunityStatus.WON,
    Priority: OpportunityPriority.HIGH,
    AssignedUserID: "U008", // Arjun Mehta
    EstimatedValue: 350000,
    Notes: "New car model launch video campaign",
    CreatedAt: new Date("2023-05-10"),
    UpdatedAt: new Date("2023-05-25")
  },
  {
    OpportunityID: "O004",
    ClientID: "C007", // SecureWealth Financial
    ServiceID: "S014", // PPC Campaign Management
    Status: OpportunityStatus.WON,
    Priority: OpportunityPriority.MEDIUM,
    AssignedUserID: "U010", // Rajiv Kumar
    EstimatedValue: 180000,
    Notes: "Q3 digital acquisition campaign",
    CreatedAt: new Date("2023-05-15"),
    UpdatedAt: new Date("2023-05-30")
  },
  {
    OpportunityID: "O005",
    ClientID: "C009", // WellCare Health Services
    ServiceID: "S003", // Blog & Article Writing
    Status: OpportunityStatus.WON,
    Priority: OpportunityPriority.LOW,
    AssignedUserID: "U008", // Arjun Mehta
    EstimatedValue: 75000,
    Notes: "Health awareness blog series",
    CreatedAt: new Date("2023-05-20"),
    UpdatedAt: new Date("2023-06-05")
  },
  
  // In Discussion Opportunities
  {
    OpportunityID: "O006",
    ClientID: "C002", // DigiSphere Technologies
    ServiceID: "S011", // Programmatic Advertising
    Status: OpportunityStatus.IN_DISCUSSION,
    Priority: OpportunityPriority.HIGH,
    AssignedUserID: "U009", // Divya Patel
    EstimatedValue: 200000,
    Notes: "Discussing campaign scope and targeting",
    CreatedAt: new Date("2023-06-01"),
    UpdatedAt: new Date("2023-06-01")
  },
  {
    OpportunityID: "O007",
    ClientID: "C004", // EverFresh Products
    ServiceID: "S005", // Brand Activations
    Status: OpportunityStatus.IN_DISCUSSION,
    Priority: OpportunityPriority.MEDIUM,
    AssignedUserID: "U011", // Meera Joshi
    EstimatedValue: 150000,
    Notes: "Summer product sampling campaign",
    CreatedAt: new Date("2023-06-05"),
    UpdatedAt: new Date("2023-06-05")
  },
  {
    OpportunityID: "O008",
    ClientID: "C006", // GreenDrive Electric
    ServiceID: "S016", // Brand Strategy
    Status: OpportunityStatus.IN_DISCUSSION,
    Priority: OpportunityPriority.HIGH,
    AssignedUserID: "U009", // Divya Patel
    EstimatedValue: 300000,
    Notes: "Brand repositioning for electric vehicle line",
    CreatedAt: new Date("2023-06-10"),
    UpdatedAt: new Date("2023-06-10")
  },
  {
    OpportunityID: "O009",
    ClientID: "C008", // FutureTrust Banking
    ServiceID: "S012", // Social Media Advertising
    Status: OpportunityStatus.IN_DISCUSSION,
    Priority: OpportunityPriority.MEDIUM,
    AssignedUserID: "U011", // Meera Joshi
    EstimatedValue: 120000,
    Notes: "Youth banking product campaign",
    CreatedAt: new Date("2023-06-15"),
    UpdatedAt: new Date("2023-06-15")
  },
  {
    OpportunityID: "O010",
    ClientID: "C010", // LifeFirst Medical Group
    ServiceID: "S004", // Event Management
    Status: OpportunityStatus.IN_DISCUSSION,
    Priority: OpportunityPriority.LOW,
    AssignedUserID: "U009", // Divya Patel
    EstimatedValue: 100000,
    Notes: "Medical conference planning",
    CreatedAt: new Date("2023-06-20"),
    UpdatedAt: new Date("2023-06-20")
  }
];

import { OpportunityStatus, OpportunityPriority, Opportunity } from './sampleOpportunities';

export const opportunitiesData2: Opportunity[] = [
  // Proposal Sent Opportunities
  {
    OpportunityID: "O011",
    ClientID: "C011", // TrendSetters Retail
    ServiceID: "S019", // Mobile App Development
    Status: OpportunityStatus.PROPOSAL_SENT,
    Priority: OpportunityPriority.HIGH,
    AssignedUserID: "U010", // Rajiv Kumar
    EstimatedValue: 400000,
    Notes: "E-commerce mobile app development",
    CreatedAt: new Date("2023-06-25"),
    UpdatedAt: new Date("2023-07-05")
  },
  {
    OpportunityID: "O012",
    ClientID: "C012", // HomeStyle Furnishings
    ServiceID: "S008", // Photography
    Status: OpportunityStatus.PROPOSAL_SENT,
    Priority: OpportunityPriority.MEDIUM,
    AssignedUserID: "U011", // Meera Joshi
    EstimatedValue: 90000,
    Notes: "Product catalog photography",
    CreatedAt: new Date("2023-06-30"),
    UpdatedAt: new Date("2023-07-10")
  },
  {
    OpportunityID: "O013",
    ClientID: "C013", // FutureMinds Education
    ServiceID: "S013", // SEO Optimization
    Status: OpportunityStatus.PROPOSAL_SENT,
    Priority: OpportunityPriority.HIGH,
    AssignedUserID: "U008", // Arjun Mehta
    EstimatedValue: 150000,
    Notes: "Course discovery SEO project",
    CreatedAt: new Date("2023-07-05"),
    UpdatedAt: new Date("2023-07-15")
  },
  {
    OpportunityID: "O014",
    ClientID: "C014", // SkillUp Training Institute
    ServiceID: "S017", // Campaign Conceptualization
    Status: OpportunityStatus.PROPOSAL_SENT,
    Priority: OpportunityPriority.MEDIUM,
    AssignedUserID: "U009", // Divya Patel
    EstimatedValue: 120000,
    Notes: "New course launch campaign",
    CreatedAt: new Date("2023-07-10"),
    UpdatedAt: new Date("2023-07-20")
  },
  {
    OpportunityID: "O015",
    ClientID: "C015", // DreamScape Entertainment
    ServiceID: "S009", // Audio Production
    Status: OpportunityStatus.PROPOSAL_SENT,
    Priority: OpportunityPriority.LOW,
    AssignedUserID: "U010", // Rajiv Kumar
    EstimatedValue: 80000,
    Notes: "Podcast series production",
    CreatedAt: new Date("2023-07-15"),
    UpdatedAt: new Date("2023-07-25")
  },
  
  // Identified Opportunities
  {
    OpportunityID: "O016",
    ClientID: "C001", // TechNova Solutions
    ServiceID: "S010", // Media Planning
    Status: OpportunityStatus.IDENTIFIED,
    Priority: OpportunityPriority.MEDIUM,
    AssignedUserID: "U008", // Arjun Mehta
    EstimatedValue: 100000,
    Notes: "Potential Q4 media campaign",
    CreatedAt: new Date("2023-07-20"),
    UpdatedAt: new Date("2023-07-20")
  },
  {
    OpportunityID: "O017",
    ClientID: "C003", // PureLife Consumer Goods
    ServiceID: "S006", // Pop-up Experiences
    Status: OpportunityStatus.IDENTIFIED,
    Priority: OpportunityPriority.LOW,
    AssignedUserID: "U010", // Rajiv Kumar
    EstimatedValue: 70000,
    Notes: "Product sampling pop-up concept",
    CreatedAt: new Date("2023-07-25"),
    UpdatedAt: new Date("2023-07-25")
  },
  {
    OpportunityID: "O018",
    ClientID: "C005", // SpeedStar Motors
    ServiceID: "S001", // Content Strategy
    Status: OpportunityStatus.IDENTIFIED,
    Priority: OpportunityPriority.MEDIUM,
    AssignedUserID: "U008", // Arjun Mehta
    EstimatedValue: 90000,
    Notes: "Content strategy refresh opportunity",
    CreatedAt: new Date("2023-07-30"),
    UpdatedAt: new Date("2023-07-30")
  },
  
  // On Hold Opportunities
  {
    OpportunityID: "O019",
    ClientID: "C007", // SecureWealth Financial
    ServiceID: "S015", // Conversion Rate Optimization
    Status: OpportunityStatus.ON_HOLD,
    Priority: OpportunityPriority.MEDIUM,
    AssignedUserID: "U010", // Rajiv Kumar
    EstimatedValue: 110000,
    Notes: "On hold due to client budget review",
    CreatedAt: new Date("2023-08-05"),
    UpdatedAt: new Date("2023-08-15")
  },
  {
    OpportunityID: "O020",
    ClientID: "C009", // WellCare Health Services
    ServiceID: "S002", // Social Media Content
    Status: OpportunityStatus.ON_HOLD,
    Priority: OpportunityPriority.LOW,
    AssignedUserID: "U008", // Arjun Mehta
    EstimatedValue: 60000,
    Notes: "Waiting for new marketing director to join",
    CreatedAt: new Date("2023-08-10"),
    UpdatedAt: new Date("2023-08-20")
  },
  
  // Lost Opportunities
  {
    OpportunityID: "O021",
    ClientID: "C002", // DigiSphere Technologies
    ServiceID: "S020", // E-commerce Solutions
    Status: OpportunityStatus.LOST,
    Priority: OpportunityPriority.HIGH,
    AssignedUserID: "U009", // Divya Patel
    EstimatedValue: 300000,
    Notes: "Lost to competitor with existing relationship",
    CreatedAt: new Date("2023-08-15"),
    UpdatedAt: new Date("2023-08-30")
  },
  {
    OpportunityID: "O022",
    ClientID: "C004", // EverFresh Products
    ServiceID: "S011", // Programmatic Advertising
    Status: OpportunityStatus.LOST,
    Priority: OpportunityPriority.MEDIUM,
    AssignedUserID: "U011", // Meera Joshi
    EstimatedValue: 150000,
    Notes: "Budget constraints led to cancellation",
    CreatedAt: new Date("2023-08-20"),
    UpdatedAt: new Date("2023-09-05")
  },
  
  // Additional Opportunities
  {
    OpportunityID: "O023",
    ClientID: "C008", // FutureTrust Banking
    ServiceID: "S016", // Brand Strategy
    Status: OpportunityStatus.IDENTIFIED,
    Priority: OpportunityPriority.HIGH,
    AssignedUserID: "U011", // Meera Joshi
    EstimatedValue: 250000,
    Notes: "Potential rebranding project",
    CreatedAt: new Date("2023-08-25"),
    UpdatedAt: new Date("2023-08-25")
  },
  {
    OpportunityID: "O024",
    ClientID: "C012", // HomeStyle Furnishings
    ServiceID: "S007", // Video Production
    Status: OpportunityStatus.IDENTIFIED,
    Priority: OpportunityPriority.LOW,
    AssignedUserID: "U011", // Meera Joshi
    EstimatedValue: 85000,
    Notes: "Product showcase video series",
    CreatedAt: new Date("2023-08-30"),
    UpdatedAt: new Date("2023-08-30")
  },
  {
    OpportunityID: "O025",
    ClientID: "C015", // DreamScape Entertainment
    ServiceID: "S001", // Content Strategy
    Status: OpportunityStatus.IN_DISCUSSION,
    Priority: OpportunityPriority.MEDIUM,
    AssignedUserID: "U010", // Rajiv Kumar
    EstimatedValue: 120000,
    Notes: "Content strategy for new streaming platform",
    CreatedAt: new Date("2023-09-05"),
    UpdatedAt: new Date("2023-09-05")
  }
];

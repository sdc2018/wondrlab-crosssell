import { sampleUsers } from './sampleUsers';

export interface Client {
  ClientID: string;
  Name: string;
  Industry: string;
  Region: string;
  Address: string;
  PrimaryAccountManagerUserID: string; // Reference to User
  PrimaryBU_ID: string; // Reference to BusinessUnit
  CreatedAt: Date;
  UpdatedAt: Date;
  IsActive: boolean;
}

export const sampleClients: Client[] = [
  // Technology Clients
  {
    ClientID: "C001",
    Name: "TechNova Solutions",
    Industry: "Technology",
    Region: "North",
    Address: "123 Tech Park, Gurugram, Haryana",
    PrimaryAccountManagerUserID: "U008", // Arjun Mehta
    PrimaryBU_ID: "BU007", // Technology Solutions
    CreatedAt: new Date("2023-03-10"),
    UpdatedAt: new Date("2023-03-10"),
    IsActive: true
  },
  {
    ClientID: "C002",
    Name: "DigiSphere Technologies",
    Industry: "Technology",
    Region: "South",
    Address: "456 Digital Avenue, Bangalore, Karnataka",
    PrimaryAccountManagerUserID: "U009", // Divya Patel
    PrimaryBU_ID: "BU004", // Digital Media
    CreatedAt: new Date("2023-03-12"),
    UpdatedAt: new Date("2023-03-12"),
    IsActive: true
  },
  
  // FMCG Clients
  {
    ClientID: "C003",
    Name: "PureLife Consumer Goods",
    Industry: "FMCG",
    Region: "West",
    Address: "789 Consumer Blvd, Mumbai, Maharashtra",
    PrimaryAccountManagerUserID: "U010", // Rajiv Kumar
    PrimaryBU_ID: "BU001", // Content
    CreatedAt: new Date("2023-03-15"),
    UpdatedAt: new Date("2023-03-15"),
    IsActive: true
  },
  {
    ClientID: "C004",
    Name: "EverFresh Products",
    Industry: "FMCG",
    Region: "East",
    Address: "321 Fresh Street, Kolkata, West Bengal",
    PrimaryAccountManagerUserID: "U011", // Meera Joshi
    PrimaryBU_ID: "BU002", // Experiential
    CreatedAt: new Date("2023-03-18"),
    UpdatedAt: new Date("2023-03-18"),
    IsActive: true
  },
  
  // Automotive Clients
  {
    ClientID: "C005",
    Name: "SpeedStar Motors",
    Industry: "Automotive",
    Region: "North",
    Address: "555 Auto Drive, New Delhi, Delhi",
    PrimaryAccountManagerUserID: "U008", // Arjun Mehta
    PrimaryBU_ID: "BU003", // Production
    CreatedAt: new Date("2023-03-20"),
    UpdatedAt: new Date("2023-03-20"),
    IsActive: true
  },
  {
    ClientID: "C006",
    Name: "GreenDrive Electric",
    Industry: "Automotive",
    Region: "South",
    Address: "777 Electric Lane, Chennai, Tamil Nadu",
    PrimaryAccountManagerUserID: "U009", // Divya Patel
    PrimaryBU_ID: "BU006", // Creative Strategy
    CreatedAt: new Date("2023-03-22"),
    UpdatedAt: new Date("2023-03-22"),
    IsActive: true
  },
  
  // Finance Clients
  {
    ClientID: "C007",
    Name: "SecureWealth Financial",
    Industry: "Finance",
    Region: "West",
    Address: "888 Finance Square, Pune, Maharashtra",
    PrimaryAccountManagerUserID: "U010", // Rajiv Kumar
    PrimaryBU_ID: "BU005", // Performance Marketing
    CreatedAt: new Date("2023-03-25"),
    UpdatedAt: new Date("2023-03-25"),
    IsActive: true
  },
  {
    ClientID: "C008",
    Name: "FutureTrust Banking",
    Industry: "Finance",
    Region: "North",
    Address: "999 Trust Tower, Noida, Uttar Pradesh",
    PrimaryAccountManagerUserID: "U011", // Meera Joshi
    PrimaryBU_ID: "BU004", // Digital Media
    CreatedAt: new Date("2023-03-28"),
    UpdatedAt: new Date("2023-03-28"),
    IsActive: true
  },
  
  // Healthcare Clients
  {
    ClientID: "C009",
    Name: "WellCare Health Services",
    Industry: "Healthcare",
    Region: "South",
    Address: "111 Wellness Road, Hyderabad, Telangana",
    PrimaryAccountManagerUserID: "U008", // Arjun Mehta
    PrimaryBU_ID: "BU001", // Content
    CreatedAt: new Date("2023-04-01"),
    UpdatedAt: new Date("2023-04-01"),
    IsActive: true
  },
  {
    ClientID: "C010",
    Name: "LifeFirst Medical Group",
    Industry: "Healthcare",
    Region: "East",
    Address: "222 Medical Park, Bhubaneswar, Odisha",
    PrimaryAccountManagerUserID: "U009", // Divya Patel
    PrimaryBU_ID: "BU002", // Experiential
    CreatedAt: new Date("2023-04-05"),
    UpdatedAt: new Date("2023-04-05"),
    IsActive: true
  },
  
  // Retail Clients
  {
    ClientID: "C011",
    Name: "TrendSetters Retail",
    Industry: "Retail",
    Region: "West",
    Address: "333 Fashion Street, Ahmedabad, Gujarat",
    PrimaryAccountManagerUserID: "U010", // Rajiv Kumar
    PrimaryBU_ID: "BU007", // Technology Solutions
    CreatedAt: new Date("2023-04-10"),
    UpdatedAt: new Date("2023-04-10"),
    IsActive: true
  },
  {
    ClientID: "C012",
    Name: "HomeStyle Furnishings",
    Industry: "Retail",
    Region: "North",
    Address: "444 Home Avenue, Jaipur, Rajasthan",
    PrimaryAccountManagerUserID: "U011", // Meera Joshi
    PrimaryBU_ID: "BU003", // Production
    CreatedAt: new Date("2023-04-15"),
    UpdatedAt: new Date("2023-04-15"),
    IsActive: true
  },
  
  // Education Clients
  {
    ClientID: "C013",
    Name: "FutureMinds Education",
    Industry: "Education",
    Region: "South",
    Address: "555 Learning Lane, Kochi, Kerala",
    PrimaryAccountManagerUserID: "U008", // Arjun Mehta
    PrimaryBU_ID: "BU005", // Performance Marketing
    CreatedAt: new Date("2023-04-20"),
    UpdatedAt: new Date("2023-04-20"),
    IsActive: true
  },
  {
    ClientID: "C014",
    Name: "SkillUp Training Institute",
    Industry: "Education",
    Region: "North",
    Address: "666 Skill Street, Chandigarh, Punjab",
    PrimaryAccountManagerUserID: "U009", // Divya Patel
    PrimaryBU_ID: "BU006", // Creative Strategy
    CreatedAt: new Date("2023-04-25"),
    UpdatedAt: new Date("2023-04-25"),
    IsActive: true
  },
  
  // Entertainment Client
  {
    ClientID: "C015",
    Name: "DreamScape Entertainment",
    Industry: "Entertainment",
    Region: "West",
    Address: "777 Entertainment Blvd, Mumbai, Maharashtra",
    PrimaryAccountManagerUserID: "U010", // Rajiv Kumar
    PrimaryBU_ID: "BU003", // Production
    CreatedAt: new Date("2023-04-30"),
    UpdatedAt: new Date("2023-04-30"),
    IsActive: true
  }
];

// Export function to get a client by ID
export const getClientById = (id: string): Client | undefined => {
  return sampleClients.find(client => client.ClientID === id);
};

// Export function to get all clients
export const getAllClients = (): Client[] => {
  return [...sampleClients];
};

// Export function to get clients by industry
export const getClientsByIndustry = (industry: string): Client[] => {
  return sampleClients.filter(client => client.Industry === industry);
};

// Export function to get clients by region
export const getClientsByRegion = (region: string): Client[] => {
  return sampleClients.filter(client => client.Region === region);
};

// Export function to get clients by account manager
export const getClientsByAccountManager = (userId: string): Client[] => {
  return sampleClients.filter(client => client.PrimaryAccountManagerUserID === userId);
};

// Export function to get clients by business unit
export const getClientsByBusinessUnit = (buId: string): Client[] => {
  return sampleClients.filter(client => client.PrimaryBU_ID === buId);
};

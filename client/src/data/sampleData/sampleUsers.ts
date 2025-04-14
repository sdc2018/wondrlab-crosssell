export enum UserRole {
  SYSTEM_ADMIN = "System Administrator",
  SALES_EXECUTIVE = "Sales / Account Executive",
  BU_HEAD = "Business Unit Head",
  SENIOR_MANAGEMENT = "Senior Management"
}

export interface User {
  UserID: string;
  Username: string;
  Name: string;
  Email: string;
  Role: UserRole;
  AssociatedBU_ID?: string; // Reference to BusinessUnit (relevant for BU Heads)
  CreatedAt: Date;
  UpdatedAt: Date;
  IsActive: boolean;
}

export const sampleUsers: User[] = [
  // System Administrators
  {
    UserID: "U001",
    Username: "admin.user",
    Name: "Admin User",
    Email: "admin@wondrlab.com",
    Role: UserRole.SYSTEM_ADMIN,
    CreatedAt: new Date("2023-01-10"),
    UpdatedAt: new Date("2023-01-10"),
    IsActive: true
  },
  {
    UserID: "U002",
    Username: "tech.admin",
    Name: "Tech Admin",
    Email: "tech.admin@wondrlab.com",
    Role: UserRole.SYSTEM_ADMIN,
    CreatedAt: new Date("2023-01-10"),
    UpdatedAt: new Date("2023-01-10"),
    IsActive: true
  },
  
  // Business Unit Heads
  {
    UserID: "U003",
    Username: "content.head",
    Name: "Priya Sharma",
    Email: "priya.sharma@wondrlab.com",
    Role: UserRole.BU_HEAD,
    AssociatedBU_ID: "BU001", // Content
    CreatedAt: new Date("2023-01-12"),
    UpdatedAt: new Date("2023-01-12"),
    IsActive: true
  },
  {
    UserID: "U004",
    Username: "experiential.head",
    Name: "Rahul Verma",
    Email: "rahul.verma@wondrlab.com",
    Role: UserRole.BU_HEAD,
    AssociatedBU_ID: "BU002", // Experiential
    CreatedAt: new Date("2023-01-12"),
    UpdatedAt: new Date("2023-01-12"),
    IsActive: true
  },
  {
    UserID: "U005",
    Username: "production.head",
    Name: "Neha Kapoor",
    Email: "neha.kapoor@wondrlab.com",
    Role: UserRole.BU_HEAD,
    AssociatedBU_ID: "BU003", // Production
    CreatedAt: new Date("2023-01-12"),
    UpdatedAt: new Date("2023-01-12"),
    IsActive: true
  },
  {
    UserID: "U006",
    Username: "digital.head",
    Name: "Vikram Singh",
    Email: "vikram.singh@wondrlab.com",
    Role: UserRole.BU_HEAD,
    AssociatedBU_ID: "BU004", // Digital Media
    CreatedAt: new Date("2023-01-12"),
    UpdatedAt: new Date("2023-01-12"),
    IsActive: true
  },
  {
    UserID: "U007",
    Username: "performance.head",
    Name: "Anjali Desai",
    Email: "anjali.desai@wondrlab.com",
    Role: UserRole.BU_HEAD,
    AssociatedBU_ID: "BU005", // Performance Marketing
    CreatedAt: new Date("2023-01-12"),
    UpdatedAt: new Date("2023-01-12"),
    IsActive: true
  },
  
  // Sales / Account Executives
  {
    UserID: "U008",
    Username: "sales.exec1",
    Name: "Arjun Mehta",
    Email: "arjun.mehta@wondrlab.com",
    Role: UserRole.SALES_EXECUTIVE,
    CreatedAt: new Date("2023-01-15"),
    UpdatedAt: new Date("2023-01-15"),
    IsActive: true
  },
  {
    UserID: "U009",
    Username: "sales.exec2",
    Name: "Divya Patel",
    Email: "divya.patel@wondrlab.com",
    Role: UserRole.SALES_EXECUTIVE,
    CreatedAt: new Date("2023-01-15"),
    UpdatedAt: new Date("2023-01-15"),
    IsActive: true
  },
  {
    UserID: "U010",
    Username: "sales.exec3",
    Name: "Rajiv Kumar",
    Email: "rajiv.kumar@wondrlab.com",
    Role: UserRole.SALES_EXECUTIVE,
    CreatedAt: new Date("2023-01-15"),
    UpdatedAt: new Date("2023-01-15"),
    IsActive: true
  },
  {
    UserID: "U011",
    Username: "sales.exec4",
    Name: "Meera Joshi",
    Email: "meera.joshi@wondrlab.com",
    Role: UserRole.SALES_EXECUTIVE,
    CreatedAt: new Date("2023-01-15"),
    UpdatedAt: new Date("2023-01-15"),
    IsActive: true
  },
  
  // Senior Management
  {
    UserID: "U012",
    Username: "ceo",
    Name: "Amit Agarwal",
    Email: "amit.agarwal@wondrlab.com",
    Role: UserRole.SENIOR_MANAGEMENT,
    CreatedAt: new Date("2023-01-05"),
    UpdatedAt: new Date("2023-01-05"),
    IsActive: true
  },
  {
    UserID: "U013",
    Username: "cfo",
    Name: "Sunita Rao",
    Email: "sunita.rao@wondrlab.com",
    Role: UserRole.SENIOR_MANAGEMENT,
    CreatedAt: new Date("2023-01-05"),
    UpdatedAt: new Date("2023-01-05"),
    IsActive: true
  },
  {
    UserID: "U014",
    Username: "coo",
    Name: "Prakash Iyer",
    Email: "prakash.iyer@wondrlab.com",
    Role: UserRole.SENIOR_MANAGEMENT,
    CreatedAt: new Date("2023-01-05"),
    UpdatedAt: new Date("2023-01-05"),
    IsActive: true
  },
  {
    UserID: "U015",
    Username: "cmo",
    Name: "Leela Krishnan",
    Email: "leela.krishnan@wondrlab.com",
    Role: UserRole.SENIOR_MANAGEMENT,
    CreatedAt: new Date("2023-01-05"),
    UpdatedAt: new Date("2023-01-05"),
    IsActive: true
  }
];

// Export function to get a user by ID
export const getUserById = (id: string): User | undefined => {
  return sampleUsers.find(user => user.UserID === id);
};

// Export function to get all users
export const getAllUsers = (): User[] => {
  return [...sampleUsers];
};

// Export function to get users by role
export const getUsersByRole = (role: UserRole): User[] => {
  return sampleUsers.filter(user => user.Role === role);
};

// Export function to get users by business unit
export const getUsersByBusinessUnit = (buId: string): User[] => {
  return sampleUsers.filter(user => user.AssociatedBU_ID === buId);
};

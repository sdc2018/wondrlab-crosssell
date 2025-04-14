import { sampleBusinessUnits } from './sampleBusinessUnits';

export interface Service {
  ServiceID: string;
  Name: string;
  Description: string;
  AssociatedBU_ID: string; // Reference to BusinessUnit
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export const sampleServices: Service[] = [
  // Content Services (BU001)
  {
    ServiceID: "S001",
    Name: "Content Strategy",
    Description: "Comprehensive content strategy development for brands",
    AssociatedBU_ID: "BU001", // Content
    IsActive: true,
    CreatedAt: new Date("2023-02-01"),
    UpdatedAt: new Date("2023-02-01")
  },
  {
    ServiceID: "S002",
    Name: "Social Media Content",
    Description: "Creation of engaging content for social media platforms",
    AssociatedBU_ID: "BU001", // Content
    IsActive: true,
    CreatedAt: new Date("2023-02-01"),
    UpdatedAt: new Date("2023-02-01")
  },
  {
    ServiceID: "S003",
    Name: "Blog & Article Writing",
    Description: "Professional blog posts and articles for brand websites",
    AssociatedBU_ID: "BU001", // Content
    IsActive: true,
    CreatedAt: new Date("2023-02-01"),
    UpdatedAt: new Date("2023-02-01")
  },
  
  // Experiential Services (BU002)
  {
    ServiceID: "S004",
    Name: "Event Management",
    Description: "End-to-end planning and execution of brand events",
    AssociatedBU_ID: "BU002", // Experiential
    IsActive: true,
    CreatedAt: new Date("2023-02-05"),
    UpdatedAt: new Date("2023-02-05")
  },
  {
    ServiceID: "S005",
    Name: "Brand Activations",
    Description: "Interactive brand experiences at public locations",
    AssociatedBU_ID: "BU002", // Experiential
    IsActive: true,
    CreatedAt: new Date("2023-02-05"),
    UpdatedAt: new Date("2023-02-05")
  },
  {
    ServiceID: "S006",
    Name: "Pop-up Experiences",
    Description: "Temporary brand installations and experiences",
    AssociatedBU_ID: "BU002", // Experiential
    IsActive: true,
    CreatedAt: new Date("2023-02-05"),
    UpdatedAt: new Date("2023-02-05")
  },
  
  // Production Services (BU003)
  {
    ServiceID: "S007",
    Name: "Video Production",
    Description: "Full-service video production from concept to final edit",
    AssociatedBU_ID: "BU003", // Production
    IsActive: true,
    CreatedAt: new Date("2023-02-10"),
    UpdatedAt: new Date("2023-02-10")
  },
  {
    ServiceID: "S008",
    Name: "Photography",
    Description: "Professional photography for brand campaigns",
    AssociatedBU_ID: "BU003", // Production
    IsActive: true,
    CreatedAt: new Date("2023-02-10"),
    UpdatedAt: new Date("2023-02-10")
  },
  {
    ServiceID: "S009",
    Name: "Audio Production",
    Description: "Podcast, music, and audio ad production",
    AssociatedBU_ID: "BU003", // Production
    IsActive: true,
    CreatedAt: new Date("2023-02-10"),
    UpdatedAt: new Date("2023-02-10")
  },
  
  // Digital Media Services (BU004)
  {
    ServiceID: "S010",
    Name: "Media Planning",
    Description: "Strategic planning for digital media campaigns",
    AssociatedBU_ID: "BU004", // Digital Media
    IsActive: true,
    CreatedAt: new Date("2023-02-15"),
    UpdatedAt: new Date("2023-02-15")
  },
  {
    ServiceID: "S011",
    Name: "Programmatic Advertising",
    Description: "Automated buying and optimization of digital ad inventory",
    AssociatedBU_ID: "BU004", // Digital Media
    IsActive: true,
    CreatedAt: new Date("2023-02-15"),
    UpdatedAt: new Date("2023-02-15")
  },
  {
    ServiceID: "S012",
    Name: "Social Media Advertising",
    Description: "Paid campaigns across social media platforms",
    AssociatedBU_ID: "BU004", // Digital Media
    IsActive: true,
    CreatedAt: new Date("2023-02-15"),
    UpdatedAt: new Date("2023-02-15")
  },
  
  // Performance Marketing Services (BU005)
  {
    ServiceID: "S013",
    Name: "SEO Optimization",
    Description: "Search engine optimization for improved organic visibility",
    AssociatedBU_ID: "BU005", // Performance Marketing
    IsActive: true,
    CreatedAt: new Date("2023-02-20"),
    UpdatedAt: new Date("2023-02-20")
  },
  {
    ServiceID: "S014",
    Name: "PPC Campaign Management",
    Description: "Pay-per-click campaign setup and optimization",
    AssociatedBU_ID: "BU005", // Performance Marketing
    IsActive: true,
    CreatedAt: new Date("2023-02-20"),
    UpdatedAt: new Date("2023-02-20")
  },
  {
    ServiceID: "S015",
    Name: "Conversion Rate Optimization",
    Description: "Improving website and landing page conversion rates",
    AssociatedBU_ID: "BU005", // Performance Marketing
    IsActive: true,
    CreatedAt: new Date("2023-02-20"),
    UpdatedAt: new Date("2023-02-20")
  },
  
  // Creative Strategy Services (BU006)
  {
    ServiceID: "S016",
    Name: "Brand Strategy",
    Description: "Comprehensive brand strategy development",
    AssociatedBU_ID: "BU006", // Creative Strategy
    IsActive: true,
    CreatedAt: new Date("2023-02-25"),
    UpdatedAt: new Date("2023-02-25")
  },
  {
    ServiceID: "S017",
    Name: "Campaign Conceptualization",
    Description: "Creative concept development for marketing campaigns",
    AssociatedBU_ID: "BU006", // Creative Strategy
    IsActive: true,
    CreatedAt: new Date("2023-02-25"),
    UpdatedAt: new Date("2023-02-25")
  },
  
  // Technology Solutions Services (BU007)
  {
    ServiceID: "S018",
    Name: "Web Development",
    Description: "Custom website and web application development",
    AssociatedBU_ID: "BU007", // Technology Solutions
    IsActive: true,
    CreatedAt: new Date("2023-03-01"),
    UpdatedAt: new Date("2023-03-01")
  },
  {
    ServiceID: "S019",
    Name: "Mobile App Development",
    Description: "Native and cross-platform mobile application development",
    AssociatedBU_ID: "BU007", // Technology Solutions
    IsActive: true,
    CreatedAt: new Date("2023-03-01"),
    UpdatedAt: new Date("2023-03-01")
  },
  {
    ServiceID: "S020",
    Name: "E-commerce Solutions",
    Description: "Custom e-commerce platform development and integration",
    AssociatedBU_ID: "BU007", // Technology Solutions
    IsActive: true,
    CreatedAt: new Date("2023-03-01"),
    UpdatedAt: new Date("2023-03-01")
  }
];

// Export function to get a service by ID
export const getServiceById = (id: string): Service | undefined => {
  return sampleServices.find(service => service.ServiceID === id);
};

// Export function to get all services
export const getAllServices = (): Service[] => {
  return [...sampleServices];
};

// Export function to get services by business unit
export const getServicesByBusinessUnit = (buId: string): Service[] => {
  return sampleServices.filter(service => service.AssociatedBU_ID === buId);
};

// Export function to get active services
export const getActiveServices = (): Service[] => {
  return sampleServices.filter(service => service.IsActive);
};

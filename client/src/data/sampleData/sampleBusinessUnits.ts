export interface BusinessUnit {
  BU_ID: string;
  Name: string;
  Description: string;
  HeadUserID?: string; // Reference to User
  CreatedAt: Date;
  UpdatedAt: Date;
}

export const sampleBusinessUnits: BusinessUnit[] = [
  {
    BU_ID: "BU001",
    Name: "Content",
    Description: "Creative content development including copywriting, video production, and social media content",
    CreatedAt: new Date("2023-01-15"),
    UpdatedAt: new Date("2023-01-15")
  },
  {
    BU_ID: "BU002",
    Name: "Experiential",
    Description: "Event management, brand activations, and experiential marketing campaigns",
    CreatedAt: new Date("2023-01-15"),
    UpdatedAt: new Date("2023-01-15")
  },
  {
    BU_ID: "BU003",
    Name: "Production",
    Description: "Video, audio, and digital content production services",
    CreatedAt: new Date("2023-01-15"),
    UpdatedAt: new Date("2023-01-15")
  },
  {
    BU_ID: "BU004",
    Name: "Digital Media",
    Description: "Digital media planning, buying, and optimization across platforms",
    CreatedAt: new Date("2023-01-15"),
    UpdatedAt: new Date("2023-01-15")
  },
  {
    BU_ID: "BU005",
    Name: "Performance Marketing",
    Description: "ROI-driven digital marketing campaigns with measurable outcomes",
    CreatedAt: new Date("2023-01-15"),
    UpdatedAt: new Date("2023-01-15")
  },
  {
    BU_ID: "BU006",
    Name: "Creative Strategy",
    Description: "Brand strategy, creative direction, and campaign conceptualization",
    CreatedAt: new Date("2023-01-15"),
    UpdatedAt: new Date("2023-01-15")
  },
  {
    BU_ID: "BU007",
    Name: "Technology Solutions",
    Description: "Custom technology development, web applications, and digital platforms",
    CreatedAt: new Date("2023-01-15"),
    UpdatedAt: new Date("2023-01-15")
  }
];

// Export function to get a business unit by ID
export const getBusinessUnitById = (id: string): BusinessUnit | undefined => {
  return sampleBusinessUnits.find(bu => bu.BU_ID === id);
};

// Export function to get all business units
export const getAllBusinessUnits = (): BusinessUnit[] => {
  return [...sampleBusinessUnits];
};

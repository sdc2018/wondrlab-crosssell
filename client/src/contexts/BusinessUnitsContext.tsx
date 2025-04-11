import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the BusinessUnit interface
export interface BusinessUnit {
  id: number;
  name: string;
  description: string;
  headName: string;
  headEmail: string;
  services: number;
  activeClients: number;
}

// Define the context interface
interface BusinessUnitsContextType {
  businessUnits: BusinessUnit[];
  addBusinessUnit: (businessUnit: Omit<BusinessUnit, 'id'>) => void;
  updateBusinessUnit: (id: number, businessUnit: Partial<BusinessUnit>) => void;
  deleteBusinessUnit: (id: number) => void;
}

// Create the context with a default value
const BusinessUnitsContext = createContext<BusinessUnitsContextType | undefined>(undefined);

// Mock data for initial business units
const initialBusinessUnits: BusinessUnit[] = [
  {
    id: 1,
    name: 'Content',
    description: 'Specializes in content creation and strategy',
    headName: 'Jane Smith',
    headEmail: 'jane.smith@wondrlab.com',
    services: 3,
    activeClients: 7
  },
  {
    id: 2,
    name: 'Digital Media',
    description: 'Focuses on digital marketing and media buying',
    headName: 'John Davis',
    headEmail: 'john.davis@wondrlab.com',
    services: 4,
    activeClients: 8
  },
  {
    id: 3,
    name: 'Video Production',
    description: 'Handles all video content production',
    headName: 'Michael Brown',
    headEmail: 'michael.brown@wondrlab.com',
    services: 2,
    activeClients: 5
  },
  {
    id: 4,
    name: 'Experiential Marketing',
    description: 'Creates immersive brand experiences',
    headName: 'Sarah Wilson',
    headEmail: 'sarah.wilson@wondrlab.com',
    services: 3,
    activeClients: 6
  },
  {
    id: 5,
    name: 'Performance Marketing',
    description: 'Specializes in results-driven marketing campaigns',
    headName: 'David Lee',
    headEmail: 'david.lee@wondrlab.com',
    services: 4,
    activeClients: 9
  }
];

// Create a provider component
export const BusinessUnitsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>(initialBusinessUnits);

  // Function to add a new business unit
  const addBusinessUnit = (businessUnit: Omit<BusinessUnit, 'id'>) => {
    const newId = businessUnits.length > 0 ? Math.max(...businessUnits.map(bu => bu.id)) + 1 : 1;
    const newBusinessUnit = { ...businessUnit, id: newId };
    setBusinessUnits([...businessUnits, newBusinessUnit]);
  };

  // Function to update an existing business unit
  const updateBusinessUnit = (id: number, updatedBusinessUnit: Partial<BusinessUnit>) => {
    setBusinessUnits(businessUnits.map(businessUnit => 
      businessUnit.id === id ? { ...businessUnit, ...updatedBusinessUnit } : businessUnit
    ));
  };

  // Function to delete a business unit
  const deleteBusinessUnit = (id: number) => {
    setBusinessUnits(businessUnits.filter(businessUnit => businessUnit.id !== id));
  };

  return (
    <BusinessUnitsContext.Provider value={{ businessUnits, addBusinessUnit, updateBusinessUnit, deleteBusinessUnit }}>
      {children}
    </BusinessUnitsContext.Provider>
  );
};

// Create a custom hook to use the context
export const useBusinessUnits = () => {
  const context = useContext(BusinessUnitsContext);
  if (context === undefined) {
    throw new Error('useBusinessUnits must be used within a BusinessUnitsProvider');
  }
  return context;
};

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the Service interface
export interface Service {
  id: number;
  name: string;
  description: string;
  businessUnit: string;
  category: string;
  activeClients: number;
  potentialClients: number;
}

// Define the context interface
interface ServicesContextType {
  services: Service[];
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: number, service: Partial<Service>) => void;
  deleteService: (id: number) => void;
}

// Create the context with a default value
const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

// Mock data for initial services
const initialServices: Service[] = [
  {
    id: 1,
    name: 'Digital Marketing Strategy',
    description: 'Comprehensive digital marketing strategy development',
    businessUnit: 'Digital Media',
    category: 'Strategy',
    activeClients: 5,
    potentialClients: 8
  },
  {
    id: 2,
    name: 'Content Creation',
    description: 'High-quality content creation for various platforms',
    businessUnit: 'Content',
    category: 'Creative',
    activeClients: 7,
    potentialClients: 4
  },
  {
    id: 3,
    name: 'Social Media Management',
    description: 'Full-service social media management and strategy',
    businessUnit: 'Digital Media',
    category: 'Marketing',
    activeClients: 6,
    potentialClients: 5
  },
  {
    id: 4,
    name: 'Video Production',
    description: 'Professional video production services',
    businessUnit: 'Video Production',
    category: 'Production',
    activeClients: 4,
    potentialClients: 7
  },
  {
    id: 5,
    name: 'Event Management',
    description: 'End-to-end event planning and execution',
    businessUnit: 'Experiential Marketing',
    category: 'Marketing',
    activeClients: 3,
    potentialClients: 6
  }
];

// Create a provider component
export const ServicesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(initialServices);

  // Function to add a new service
  const addService = (service: Omit<Service, 'id'>) => {
    const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
    const newService = { ...service, id: newId };
    setServices([...services, newService]);
  };

  // Function to update an existing service
  const updateService = (id: number, updatedService: Partial<Service>) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, ...updatedService } : service
    ));
  };

  // Function to delete a service
  const deleteService = (id: number) => {
    setServices(services.filter(service => service.id !== id));
  };

  return (
    <ServicesContext.Provider value={{ services, addService, updateService, deleteService }}>
      {children}
    </ServicesContext.Provider>
  );
};

// Create a custom hook to use the context
export const useServices = () => {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};

// Common types used throughout the application

// Opportunity status enum
export enum OpportunityStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WON = 'WON',
  LOST = 'LOST',
  ON_HOLD = 'ON_HOLD'
}

// Opportunity priority enum
export enum OpportunityPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// User role enum
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SALES_REP = 'SALES_REP',
  VIEWER = 'VIEWER'
}

// Client interface
export interface Client {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  website?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

// Service interface
export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price?: number;
  createdAt: string;
  updatedAt: string;
}

// Opportunity interface
export interface Opportunity {
  id: string;
  clientId: string;
  serviceId: string;
  status: OpportunityStatus;
  priority: OpportunityPriority;
  assignedUserId: string;
  estimatedValue: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// User interface
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Business Unit interface
export interface BusinessUnit {
  id: string;
  name: string;
  description: string;
  managerId: string;
  createdAt: string;
  updatedAt: string;
}

// Task interface
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignedUserId: string;
  relatedOpportunityId?: string;
  createdAt: string;
  updatedAt: string;
}

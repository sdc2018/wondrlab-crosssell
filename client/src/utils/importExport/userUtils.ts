/**
 * Import/Export utilities for Users
 */
import { User, UserRole } from '../../data/sampleData';
import {
  convertToCSV,
  parseCSV,
  convertToJSON,
  parseJSON,
  downloadCSV,
  downloadJSON,
  handleFileUpload
} from './baseUtils';

// User CSV headers
const USER_HEADERS = ['UserID', 'Username', 'Name', 'Email', 'Role', 'AssociatedBU_ID', 'CreatedAt', 'UpdatedAt', 'IsActive'];

// Function to convert a User to CSV row data
const getUserRowData = (user: User): string[] => {
  return [
    user.UserID,
    user.Username,
    user.Name,
    user.Email,
    user.Role,
    user.AssociatedBU_ID || '',
    user.CreatedAt.toISOString(),
    user.UpdatedAt.toISOString(),
    user.IsActive.toString()
  ];
};

// Function to create a User from CSV row data
const createUserFromCSV = (rowData: Record<string, string>): User => {
  return {
    UserID: rowData.UserID,
    Username: rowData.Username,
    Name: rowData.Name,
    Email: rowData.Email,
    Role: rowData.Role as UserRole,
    AssociatedBU_ID: rowData.AssociatedBU_ID || undefined,
    CreatedAt: new Date(rowData.CreatedAt),
    UpdatedAt: new Date(rowData.UpdatedAt),
    IsActive: rowData.IsActive.toLowerCase() === 'true'
  };
};

// Export Users to CSV
export const exportUsersToCSV = (users: User[], filename: string = 'users.csv'): void => {
  downloadCSV(users, USER_HEADERS, getUserRowData, filename);
};

// Export Users to JSON
export const exportUsersToJSON = (users: User[], filename: string = 'users.json'): void => {
  downloadJSON(users, filename);
};

// Import Users from CSV
export const importUsersFromCSV = (csvData: string): User[] => {
  return parseCSV(csvData, USER_HEADERS, createUserFromCSV);
};

// Import Users from JSON
export const importUsersFromJSON = (jsonData: string): User[] => {
  return parseJSON<User>(jsonData);
};

// Handle User file upload
export const handleUserFileUpload = (
  file: File,
  onCSVLoad: (users: User[]) => void,
  onJSONLoad: (users: User[]) => void
): void => {
  handleFileUpload(file, (content) => {
    if (file.name.endsWith('.csv')) {
      const users = importUsersFromCSV(content);
      onCSVLoad(users);
    } else if (file.name.endsWith('.json')) {
      const users = importUsersFromJSON(content);
      onJSONLoad(users);
    }
  });
};

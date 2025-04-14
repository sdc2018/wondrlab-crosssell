import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, sampleUsers } from '../../data/sampleData';

// Define the shape of our authentication context
interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  hasPermission: () => false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth available to any child component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for existing auth on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // In a real app, this would make an API call to verify credentials
  // For this demo, we're just checking against our sample data
  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple "authentication" against sample data
    // In a real app, this would be a proper API call with password hashing
    const user = sampleUsers.find(u => u.Username === username);
    
    if (user) {
      // In a real app, we'd verify the password here
      // For demo purposes, we'll just accept any password
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  // Check if user has permission based on their role
  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!currentUser) return false;
    return requiredRoles.includes(currentUser.Role);
  };

  // Provide the auth context value to children components
  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

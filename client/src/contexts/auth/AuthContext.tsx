import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define user roles
export type UserRole = 'Admin' | 'SalesExec' | 'BUManager' | 'Executive';

// Define the User interface
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  associatedBU: string | null;
  isActive: boolean;
}

// Sample users for testing
const sampleUsers: User[] = [
  {
    id: 1,
    name: 'Alice Thompson',
    email: 'alice.thompson@wondrlab.com',
    role: 'Admin',
    associatedBU: null,
    isActive: true
  },
  {
    id: 2,
    name: 'Bob Richards',
    email: 'bob.richards@wondrlab.com',
    role: 'SalesExec',
    associatedBU: null,
    isActive: true
  },
  {
    id: 3,
    name: 'Carol White',
    email: 'carol.white@wondrlab.com',
    role: 'BUManager',
    associatedBU: 'Content',
    isActive: true
  },
  {
    id: 4,
    name: 'David Miller',
    email: 'david.miller@wondrlab.com',
    role: 'BUManager',
    associatedBU: 'Digital Media',
    isActive: true
  },
  {
    id: 5,
    name: 'Eva Garcia',
    email: 'eva.garcia@wondrlab.com',
    role: 'Executive',
    associatedBU: null,
    isActive: true
  }
];

// Define the context interface
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: {
    (usernameOrCredentials: string, password: string): Promise<boolean>;
    (credentials: { email: string; password: string }): Promise<boolean>;
  };
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Login function - handles both object and separate parameters
  const login = async (
    usernameOrCredentials: string | { email: string; password: string }, 
    passwordParam?: string
  ): Promise<boolean> => {
    // Determine if we're using object or separate parameters
    let email: string;
    let password: string;
    
    if (typeof usernameOrCredentials === 'string') {
      // Using separate parameters (username, password)
      email = usernameOrCredentials;
      password = passwordParam || '';
    } else {
      // Using object parameter ({ email, password })
      email = usernameOrCredentials.email;
      password = usernameOrCredentials.password;
    }
    
    console.log('Login attempt:', { email, password });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user by email (in a real app, this would be handled by the backend)
    const foundUser = sampleUsers.find(u => 
      u.email === email || 
      u.email.split('@')[0] === email || // Allow login with just the username part
      u.name.toLowerCase().replace(' ', '.') === email.toLowerCase() // Allow login with name.surname format
    );
    
    console.log('Found user:', foundUser);
    
    // Check if user exists and password is correct (simplified for demo)
    if (foundUser && password === 'password') {
      setUser(foundUser);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  // Check if user has a specific role or any of the roles in an array
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };

  // Provide the auth context to children components
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook for using the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
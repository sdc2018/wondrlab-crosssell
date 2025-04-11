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

// Define the context interface
interface UsersContextType {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: number, user: Partial<User>) => void;
  deleteUser: (id: number) => void;
  toggleUserStatus: (id: number) => void;
}

// Create the context with a default value
const UsersContext = createContext<UsersContextType | undefined>(undefined);

// Mock data for initial users
const initialUsers: User[] = [
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

// Create a provider component
export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  // Function to add a new user
  const addUser = (user: Omit<User, 'id'>) => {
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = { ...user, id: newId };
    setUsers([...users, newUser]);
  };

  // Function to update an existing user
  const updateUser = (id: number, updatedUser: Partial<User>) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, ...updatedUser } : user
    ));
  };

  // Function to delete a user
  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  // Function to toggle user active status
  const toggleUserStatus = (id: number) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ));
  };

  return (
    <UsersContext.Provider value={{ users, addUser, updateUser, deleteUser, toggleUserStatus }}>
      {children}
    </UsersContext.Provider>
  );
};

// Create a custom hook to use the context
export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

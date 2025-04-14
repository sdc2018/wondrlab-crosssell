import { UserRole } from '../../data/sampleData';
import { sampleUsers, User } from '../../data/sampleData/sampleUsers';

// Mock API service for users
const userService = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...sampleUsers];
  },

  // Get user by ID
  getById: async (id: string): Promise<User> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = sampleUsers.find(user => user.UserID === id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    return { ...user };
  },

  // Create new user
  create: async (userData: Partial<User>): Promise<User> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate a new ID (in a real app, this would be done by the backend)
    const newId = `U${String(sampleUsers.length + 1).padStart(3, '0')}`;
    
    const newUser: User = {
      UserID: newId,
      Username: userData.Username || userData.Email?.split('@')[0] || `user_${newId.toLowerCase()}`,
      Name: userData.Name || '',
      Email: userData.Email || '',
      Role: userData.Role || UserRole.SALES_EXECUTIVE,
      AssociatedBU_ID: userData.AssociatedBU_ID,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
      IsActive: userData.IsActive !== undefined ? userData.IsActive : true,
    };
    
    // In a real app, this would be a POST request to the backend
    sampleUsers.push(newUser);
    
    return { ...newUser };
  },

  // Update existing user
  update: async (id: string, userData: Partial<User>): Promise<User> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = sampleUsers.findIndex(user => user.UserID === id);
    if (userIndex === -1) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    // Update user data
    const updatedUser: User = {
      ...sampleUsers[userIndex],
      ...userData,
      UpdatedAt: new Date(),
    };
    
    // In a real app, this would be a PUT request to the backend
    sampleUsers[userIndex] = updatedUser;
    
    return { ...updatedUser };
  },

  // Delete user
  delete: async (id: string): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = sampleUsers.findIndex(user => user.UserID === id);
    if (userIndex === -1) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    // In a real app, this would be a DELETE request to the backend
    sampleUsers.splice(userIndex, 1);
  },

  // Get users by role
  getByRole: async (role: UserRole): Promise<User[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return sampleUsers.filter(user => user.Role === role);
  },

  // Get users by business unit
  getByBusinessUnit: async (buId: string): Promise<User[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return sampleUsers.filter(user => user.AssociatedBU_ID === buId);
  }
};

export default userService;
export type { User };
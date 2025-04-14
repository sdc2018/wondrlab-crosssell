import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import UserList from './UserList';
import { UserRole } from '../../data/sampleData';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

const UserManagement: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage users and their roles in the system. Only System Administrators can access this page.
        </Typography>
        
        <UserList />
      </Box>
    </Container>
  );
};

// Wrap the component with ProtectedRoute to restrict access
const ProtectedUserManagement: React.FC = () => (
  <ProtectedRoute requiredRoles={[UserRole.SYSTEM_ADMIN]}>
    <UserManagement />
  </ProtectedRoute>
);

export default ProtectedUserManagement;

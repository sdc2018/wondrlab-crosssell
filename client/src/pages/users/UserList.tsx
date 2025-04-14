import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Stack,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ImportExportButtons from '../../components/common/ImportExportButtons';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import userService, { User } from '../../services/api/userService';
import { UserRole } from '../../data/sampleData';

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleView = (user: User) => {
    navigate(`/users/${user.UserID}`);
  };
  
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setOpenForm(true);
  };
  
  const handleDelete = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.Name}?`)) {
      try {
        await userService.delete(user.UserID);
        setSnackbar({
          open: true,
          message: 'User deleted successfully',
          severity: 'success',
        });
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
        setSnackbar({
          open: true,
          message: 'Failed to delete user',
          severity: 'error',
        });
      }
    }
  };

  const handleFormSubmit = async (formData: any) => {
    setSubmitting(true);
    try {
      if (editingUser) {
        await userService.update(editingUser.UserID, formData);
        setSnackbar({
          open: true,
          message: 'User updated successfully',
          severity: 'success',
        });
      } else {
        await userService.create(formData);
        setSnackbar({
          open: true,
          message: 'User created successfully',
          severity: 'success',
        });
      }
      setOpenForm(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Error saving user:', err);
      setSnackbar({
        open: true,
        message: 'Failed to save user',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImportUsers = async (importedData: any[]) => {
    setLoading(true);
    try {
      // Process each imported user
      const results = await Promise.all(
        importedData.map(async (user) => {
          // Check if user with same email already exists
          const existingUsers = await userService.getAll();
          const existingUser = existingUsers.find(
            (u) => u.Email.toLowerCase() === user.Email.toLowerCase()
          );

          if (existingUser) {
      // Update existing user
            return await userService.update(existingUser.UserID, user);
    } else {
      // Create new user
            return await userService.create(user);
          }
        })
      );

      setSnackbar({
        open: true,
        message: `Successfully imported ${results.length} users`,
        severity: 'success',
      });
      
      // Refresh the user list
      fetchUsers();
      return results;
    } catch (err) {
      console.error('Error importing users:', err);
      setSnackbar({
        open: true,
        message: 'Failed to import users',
        severity: 'error',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingUser(null);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { id: 'Name', label: 'Name', minWidth: 170 },
    { id: 'Email', label: 'Email', minWidth: 200 },
    {
      id: 'Role',
      label: 'Role',
      minWidth: 150,
      // Return a string representation instead of a React Element
      format: (value: UserRole) => value
    },
    {
      id: 'BusinessUnit',
      label: 'Business Unit',
      minWidth: 150,
      format: (value: any) => value?.Name || '—',
    },
    {
      id: 'IsActive',
      label: 'Status',
      minWidth: 100,
      format: (value: boolean) => (value ? 'Active' : 'Inactive'),
    },
  ];

  // Required fields for user import validation
  const requiredFields = ['Name', 'Email', 'Role'];

  // Custom validators for user fields
  const validators = {
    Email: (value: string) => 
      !value ? 'Email is required' : 
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ? 'Invalid email address' : null,
    Role: (value: string) => 
      !value ? 'Role is required' : 
      Object.values(UserRole).includes(value as UserRole) ? null : 'Invalid role',
    IsActive: (value: any) => 
      value === undefined ? null : 
      typeof value === 'boolean' || value === 'true' || value === 'false' ? null : 
      'IsActive must be a boolean value',
  };

  // Render role with a Chip component in the table
  const renderRoleWithChip = (role: UserRole) => (
    <Chip 
      label={role} 
      color={
        role === UserRole.SYSTEM_ADMIN 
          ? 'primary' 
          : role === UserRole.BU_HEAD 
            ? 'secondary' 
            : role === UserRole.SENIOR_MANAGEMENT 
              ? 'info' 
              : 'default'
      } 
      size="small" 
    />
  );
  
  return (
    <ProtectedRoute requiredRoles={[UserRole.SYSTEM_ADMIN]}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Users
      </Typography>
          <Stack direction="row" spacing={2}>
            <ImportExportButtons
              entityName="Users"
              data={users}
              onImport={handleImportUsers}
              requiredFields={requiredFields}
              validators={validators}
              disabled={loading}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingUser(null);
                setOpenForm(true);
              }}
            >
              Add User
            </Button>
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            title="User List"
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
              )}

        <FormDialog
          open={openForm}
          onClose={handleCloseForm}
          title={editingUser ? 'Edit User' : 'Add User'}
          onSubmit={handleFormSubmit}
          isSubmitting={submitting}
          submitLabel={editingUser ? 'Update' : 'Create'}
        >
          <UserForm user={editingUser} onSubmit={handleFormSubmit} />
        </FormDialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ProtectedRoute>
  );
};

// User Form component
const UserForm: React.FC<{ user: User | null; onSubmit: (formData: any) => void }> = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Username: '',
    Role: UserRole.SALES_EXECUTIVE,
    AssociatedBU_ID: '',
    IsActive: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        Name: user.Name || '',
        Email: user.Email || '',
        Username: user.Username || '',
        Role: user.Role || UserRole.SALES_EXECUTIVE,
        AssociatedBU_ID: user.AssociatedBU_ID || '',
        IsActive: user.IsActive !== undefined ? user.IsActive : true,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Simplified form - in a real application, this would be more detailed
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography>This is a simplified user form. In a real application, this would include fields for all user properties.</Typography>
    </Box>
  );
};

export default UserList;
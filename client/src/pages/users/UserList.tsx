import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  Chip,
  Toolbar,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { User, UserRole, sampleUsers } from '../../data/sampleData';
import { useAuth } from '../../contexts/auth/AuthContext';
import UserForm from './UserForm';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  const { currentUser } = useAuth();
  
  // Load users
  useEffect(() => {
    // In a real app, this would be an API call
    setUsers(sampleUsers);
    setFilteredUsers(sampleUsers);
  }, []);
  
  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      user => 
        user.Name.toLowerCase().includes(query) ||
        user.Username.toLowerCase().includes(query) ||
        user.Email.toLowerCase().includes(query) ||
        user.Role.toLowerCase().includes(query)
    );
    
    setFilteredUsers(filtered);
  }, [searchQuery, users]);
  
  // Handle opening the form for creating a new user
  const handleAddUser = () => {
    setEditingUser(null);
    setOpenForm(true);
  };
  
  // Handle opening the form for editing an existing user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setOpenForm(true);
  };
  
  // Handle opening the delete confirmation dialog
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };
  
  // Handle confirming user deletion
  const handleConfirmDelete = () => {
    if (userToDelete) {
      // In a real app, this would be an API call
      const updatedUsers = users.filter(user => user.UserID !== userToDelete.UserID);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };
  
  // Handle canceling user deletion
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };
  
  // Handle form submission (create/edit user)
  const handleFormSubmit = (userData: User) => {
    // In a real app, this would be an API call
    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map(user => 
        user.UserID === userData.UserID ? userData : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } else {
      // Create new user
      const newUser = {
        ...userData,
        UserID: `U${(users.length + 1).toString().padStart(3, '0')}`,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    }
    
    setOpenForm(false);
    setEditingUser(null);
  };
  
  // Handle closing the form
  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingUser(null);
  };
  
  // Get color for role chip
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SYSTEM_ADMIN:
        return 'error';
      case UserRole.BU_HEAD:
        return 'primary';
      case UserRole.SALES_EXECUTIVE:
        return 'success';
      case UserRole.SENIOR_MANAGEMENT:
        return 'warning';
      default:
        return 'default';
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
          <Box sx={{ flex: '1 1 100%' }}>
            <TextField
              variant="outlined"
              placeholder="Search users..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ width: 300 }}
            />
          </Box>
          
          <Tooltip title="Add User">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddUser}
              sx={{ ml: 2 }}
            >
              Add User
            </Button>
          </Tooltip>
        </Toolbar>
        
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow hover key={user.UserID}>
                  <TableCell>{user.Name}</TableCell>
                  <TableCell>{user.Username}</TableCell>
                  <TableCell>{user.Email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.Role} 
                      color={getRoleColor(user.Role) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.IsActive ? 'Active' : 'Inactive'} 
                      color={user.IsActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEditUser(user)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Delete">
                      <IconButton 
                        onClick={() => handleDeleteClick(user)}
                        disabled={user.UserID === currentUser?.UserID}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* User Form Dialog */}
      {openForm && (
        <UserForm
          open={openForm}
          user={editingUser}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user "{userToDelete?.Name}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;

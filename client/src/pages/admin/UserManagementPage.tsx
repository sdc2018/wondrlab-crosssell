import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  InputAdornment,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { CSVLink } from 'react-csv';
import UserList from '../../components/users/UserList';
import { useUsers } from '../../contexts/UsersContext';

const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { users, toggleUserStatus, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [addMenuAnchorEl, setAddMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [exportMenuAnchorEl, setExportMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [importMenuAnchorEl, setImportMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddClick = (event: React.MouseEvent<HTMLElement>) => {
    setAddMenuAnchorEl(event.currentTarget);
  };

  const handleAddClose = () => {
    setAddMenuAnchorEl(null);
  };

  const handleAddNewUser = () => {
    handleAddClose();
    navigate('/admin/users/new');
  };

  const handleAddFromTemplate = () => {
    handleAddClose();
    // Future functionality
    alert('Add from template functionality will be implemented in a future release');
  };

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportMenuAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportMenuAnchorEl(null);
  };

  const handleImportClick = (event: React.MouseEvent<HTMLElement>) => {
    setImportMenuAnchorEl(event.currentTarget);
  };

  const handleImportClose = () => {
    setImportMenuAnchorEl(null);
  };

  const handleToggleStatus = (id: number) => {
    toggleUserStatus(id);
  };

  const handleDeleteUser = (id: number) => {
    deleteUser(id);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower) ||
      (user.associatedBU && user.associatedBU.toLowerCase().includes(searchLower))
    );
  });

  // Prepare data for CSV export
  const exportData = filteredUsers.map(user => ({
    ID: user.id,
    Name: user.name,
    Email: user.email,
    Role: user.role,
    'Business Unit': user.associatedBU || 'N/A',
    Status: user.isActive ? 'Active' : 'Inactive'
  }));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">User Management</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add
          </Button>
          <Menu
            anchorEl={addMenuAnchorEl}
            open={Boolean(addMenuAnchorEl)}
            onClose={handleAddClose}
          >
            <MenuItem onClick={handleAddNewUser}>Add New User</MenuItem>
            <MenuItem onClick={handleAddFromTemplate}>Add From Template</MenuItem>
          </Menu>
          
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={handleExportClick}
          >
            Export
          </Button>
          <Menu
            anchorEl={exportMenuAnchorEl}
            open={Boolean(exportMenuAnchorEl)}
            onClose={handleExportClose}
          >
            <MenuItem onClick={handleExportClose}>
              <CSVLink 
                data={exportData} 
                filename={"users.csv"}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Export as CSV
              </CSVLink>
            </MenuItem>
            <MenuItem onClick={handleExportClose}>Export as Excel</MenuItem>
            <MenuItem onClick={handleExportClose}>Export as PDF</MenuItem>
          </Menu>
          
          <Button 
            variant="outlined" 
            startIcon={<UploadIcon />}
            onClick={handleImportClick}
          >
            Import
          </Button>
          <Menu
            anchorEl={importMenuAnchorEl}
            open={Boolean(importMenuAnchorEl)}
            onClose={handleImportClose}
          >
            <MenuItem onClick={handleImportClose}>Import from CSV</MenuItem>
            <MenuItem onClick={handleImportClose}>Import from Excel</MenuItem>
          </Menu>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Box>
        </Box>
      </Paper>
      
      <UserList 
        users={filteredUsers} 
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteUser}
      />
    </Box>
  );
};

export default UserManagementPage;

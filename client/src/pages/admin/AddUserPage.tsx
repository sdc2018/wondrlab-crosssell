import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  IconButton,
  SelectChangeEvent,
  FormHelperText,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { useUsers, UserRole } from '../../contexts/UsersContext';
import { useBusinessUnits } from '../../contexts/BusinessUnitsContext';

const AddUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { addUser } = useUsers();
  const { businessUnits } = useBusinessUnits();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '' as UserRole,
    associatedBU: '',
    isActive: true,
  });
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    role: false,
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is filled
    if (name && errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: false,
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    
    // Clear associated BU if role is not BUManager
    if (name === 'role' && value !== 'BUManager') {
      setFormData({
        ...formData,
        [name]: value as UserRole,
        associatedBU: '',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error when field is filled
    if (name && errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: false,
      });
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      isActive: e.target.checked,
    });
  };

  const handleCancel = () => {
    navigate('/admin/users');
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email === '' || re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors = {
      name: !formData.name,
      email: !formData.email || !validateEmail(formData.email),
      role: !formData.role,
    };
    
    setErrors(newErrors);
    
    // If any errors, don't submit
    if (Object.values(newErrors).some(error => error)) {
      return;
    }
    
    // Add the new user using the context function
    addUser({
      ...formData,
      associatedBU: formData.associatedBU || null,
    });
    
    // Show success message and navigate back to users list
    alert('User added successfully!');
    navigate('/admin/users');
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={handleCancel}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            Add New User
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <TextField
                  required
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleTextChange}
                  error={errors.name}
                  helperText={errors.name ? 'Name is required' : ''}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleTextChange}
                  error={errors.email}
                  helperText={errors.email ? 'Please enter a valid email address' : ''}
                  variant="outlined"
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth required error={errors.role}>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    name="role"
                    value={formData.role}
                    label="Role"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="SalesExec">Sales Executive</MenuItem>
                    <MenuItem value="BUManager">Business Unit Manager</MenuItem>
                    <MenuItem value="Executive">Executive</MenuItem>
                  </Select>
                  {errors.role && <FormHelperText>Role is required</FormHelperText>}
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl 
                  fullWidth 
                  disabled={formData.role !== 'BUManager'}
                >
                  <InputLabel id="bu-label">Associated Business Unit</InputLabel>
                  <Select
                    labelId="bu-label"
                    name="associatedBU"
                    value={formData.associatedBU}
                    label="Associated Business Unit"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="">None</MenuItem>
                    {businessUnits.map((bu) => (
                      <MenuItem key={bu.id} value={bu.name}>{bu.name}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {formData.role === 'BUManager' 
                      ? 'Required for Business Unit Managers' 
                      : 'Only applicable for Business Unit Managers'}
                  </FormHelperText>
                </FormControl>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleSwitchChange}
                    color="primary"
                  />
                }
                label="Active"
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                onClick={handleCancel}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="contained" 
                startIcon={<SaveIcon />}
              >
                Save User
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddUserPage;
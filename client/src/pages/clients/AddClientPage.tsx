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
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

// Mock data for dropdown options
const INDUSTRIES = ['Technology', 'Fashion', 'Food & Beverage', 'Finance', 'Healthcare', 'Retail'];
const REGIONS = ['North', 'South', 'East', 'West', 'Central'];
const BUSINESS_UNITS = ['Content', 'Experiential Marketing', 'Video Production', 'Digital Media', 'Performance Marketing'];
const ACCOUNT_MANAGERS = [
  { id: 1, name: 'Alice Thompson' },
  { id: 2, name: 'Bob Richards' },
  { id: 3, name: 'Carol White' },
  { id: 4, name: 'David Miller' },
  { id: 5, name: 'Eva Garcia' }
];

const AddClientPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    region: '',
    primaryBU: '',
    primaryContact: '',
    email: '',
    phone: '',
    primaryAccountManager: '',
  });
  const [errors, setErrors] = useState({
    name: false,
    industry: false,
    region: false,
    primaryBU: false,
    primaryContact: false,
    email: false,
    primaryAccountManager: false,
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

  const handleCancel = () => {
    navigate('/clients');
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
      industry: !formData.industry,
      region: !formData.region,
      primaryBU: !formData.primaryBU,
      primaryContact: !formData.primaryContact,
      email: !validateEmail(formData.email),
      primaryAccountManager: !formData.primaryAccountManager,
    };
    
    setErrors(newErrors);
    
    // If any errors, don't submit
    if (Object.values(newErrors).some(error => error)) {
      return;
    }
    
    // In a real app, this would save the new client to the database
    console.log('Submitting client:', formData);
    
    // Show success message and navigate back to clients list
    alert('Client added successfully!');
    navigate('/clients');
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
            Add New Client
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <TextField
                  required
                  fullWidth
                  label="Client Name"
                  name="name"
                  value={formData.name}
                  onChange={handleTextChange}
                  error={errors.name}
                  helperText={errors.name ? 'Client name is required' : ''}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth required error={errors.industry}>
                  <InputLabel id="industry-label">Industry</InputLabel>
                  <Select
                    labelId="industry-label"
                    name="industry"
                    value={formData.industry}
                    label="Industry"
                    onChange={handleSelectChange}
                  >
                    {INDUSTRIES.map((industry) => (
                      <MenuItem key={industry} value={industry}>{industry}</MenuItem>
                    ))}
                  </Select>
                  {errors.industry && <FormHelperText>Industry is required</FormHelperText>}
                </FormControl>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth required error={errors.region}>
                  <InputLabel id="region-label">Region</InputLabel>
                  <Select
                    labelId="region-label"
                    name="region"
                    value={formData.region}
                    label="Region"
                    onChange={handleSelectChange}
                  >
                    {REGIONS.map((region) => (
                      <MenuItem key={region} value={region}>{region}</MenuItem>
                    ))}
                  </Select>
                  {errors.region && <FormHelperText>Region is required</FormHelperText>}
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth required error={errors.primaryBU}>
                  <InputLabel id="primaryBU-label">Primary Business Unit</InputLabel>
                  <Select
                    labelId="primaryBU-label"
                    name="primaryBU"
                    value={formData.primaryBU}
                    label="Primary Business Unit"
                    onChange={handleSelectChange}
                  >
                    {BUSINESS_UNITS.map((bu) => (
                      <MenuItem key={bu} value={bu}>{bu}</MenuItem>
                    ))}
                  </Select>
                  {errors.primaryBU && <FormHelperText>Primary Business Unit is required</FormHelperText>}
                </FormControl>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <TextField
                  required
                  fullWidth
                  label="Primary Contact Name"
                  name="primaryContact"
                  value={formData.primaryContact}
                  onChange={handleTextChange}
                  error={errors.primaryContact}
                  helperText={errors.primaryContact ? 'Primary contact name is required' : ''}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth required error={errors.primaryAccountManager}>
                  <InputLabel id="primaryAccountManager-label">Primary Account Manager</InputLabel>
                  <Select
                    labelId="primaryAccountManager-label"
                    name="primaryAccountManager"
                    value={formData.primaryAccountManager}
                    label="Primary Account Manager"
                    onChange={handleSelectChange}
                  >
                    {ACCOUNT_MANAGERS.map((manager) => (
                      <MenuItem key={manager.id} value={manager.id.toString()}>{manager.name}</MenuItem>
                    ))}
                  </Select>
                  {errors.primaryAccountManager && <FormHelperText>Primary Account Manager is required</FormHelperText>}
                </FormControl>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <TextField
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
              <Box sx={{ flex: '1 1 300px' }}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleTextChange}
                  variant="outlined"
                />
              </Box>
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
                Save Client
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddClientPage;

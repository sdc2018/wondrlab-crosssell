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
  FormHelperText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { useBusinessUnits } from '../../contexts/BusinessUnitsContext';

// Mock data for dropdown options
const REGIONS = ['North', 'South', 'East', 'West', 'Central'];

const AddBusinessUnitPage: React.FC = () => {
  const navigate = useNavigate();
  const { addBusinessUnit } = useBusinessUnits(); // Use the addBusinessUnit function from context
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    headName: '',
    headEmail: '',
    region: '',
  });
  const [errors, setErrors] = useState({
    name: false,
    description: false,
    headName: false,
    headEmail: false,
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
  };

  const handleCancel = () => {
    navigate('/business-units');
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
      description: !formData.description,
      headName: !formData.headName,
      headEmail: !validateEmail(formData.headEmail),
    };
    
    setErrors(newErrors);
    
    // If any errors, don't submit
    if (Object.values(newErrors).some(error => error)) {
      return;
    }
    
    // Add the new business unit using the context function
    addBusinessUnit({
      ...formData,
      services: 0, // New business unit starts with 0 services
      activeClients: 0, // Initialize active clients to 0
    });
    
    // Show success message and navigate back to business units list
    alert('Business Unit added successfully!');
    navigate('/business-units');
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
            Add New Business Unit
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <TextField
                  required
                  fullWidth
                  label="Business Unit Name"
                  name="name"
                  value={formData.name}
                  onChange={handleTextChange}
                  error={errors.name}
                  helperText={errors.name ? 'Business Unit name is required' : ''}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth>
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
                </FormControl>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <TextField
                  required
                  fullWidth
                  label="Head Name"
                  name="headName"
                  value={formData.headName}
                  onChange={handleTextChange}
                  error={errors.headName}
                  helperText={errors.headName ? 'Head name is required' : ''}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <TextField
                  fullWidth
                  label="Head Email"
                  name="headEmail"
                  type="email"
                  value={formData.headEmail}
                  onChange={handleTextChange}
                  error={errors.headEmail}
                  helperText={errors.headEmail ? 'Please enter a valid email address' : ''}
                  variant="outlined"
                />
              </Box>
            </Box>
            
            <Box sx={{ width: '100%' }}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleTextChange}
                error={errors.description}
                helperText={errors.description ? 'Description is required' : ''}
                variant="outlined"
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
                Save Business Unit
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddBusinessUnitPage;

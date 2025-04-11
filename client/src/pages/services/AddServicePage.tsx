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
import { useServices } from '../../contexts/ServicesContext';

// Mock data for dropdown options
const BUSINESS_UNITS = ['Content', 'Experiential Marketing', 'Video Production', 'Digital Media', 'Performance Marketing'];
const CATEGORIES = ['Strategy', 'Creative', 'Marketing', 'Production', 'Technology'];

const AddServicePage: React.FC = () => {
  const navigate = useNavigate();
  const { addService } = useServices(); // Use the addService function from context
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    businessUnit: '',
    category: '',
  });
  const [errors, setErrors] = useState({
    name: false,
    description: false,
    businessUnit: false,
    category: false,
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
    navigate('/services');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors = {
      name: !formData.name,
      description: !formData.description,
      businessUnit: !formData.businessUnit,
      category: !formData.category,
    };
    
    setErrors(newErrors);
    
    // If any errors, don't submit
    if (Object.values(newErrors).some(error => error)) {
      return;
    }
    
    // Add the new service using the context function
    addService({
      ...formData,
      activeClients: 0, // New service starts with 0 active clients
      potentialClients: 0, // Initialize potential clients to 0
    });
    
    // Show success message and navigate back to services list
    alert('Service added successfully!');
    navigate('/services');
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
            Add New Service
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <TextField
                  required
                  fullWidth
                  label="Service Name"
                  name="name"
                  value={formData.name}
                  onChange={handleTextChange}
                  error={errors.name}
                  helperText={errors.name ? 'Service name is required' : ''}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth required error={errors.category}>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={formData.category}
                    label="Category"
                    onChange={handleSelectChange}
                  >
                    {CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                  {errors.category && <FormHelperText>Category is required</FormHelperText>}
                </FormControl>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth required error={errors.businessUnit}>
                  <InputLabel id="businessUnit-label">Business Unit</InputLabel>
                  <Select
                    labelId="businessUnit-label"
                    name="businessUnit"
                    value={formData.businessUnit}
                    label="Business Unit"
                    onChange={handleSelectChange}
                  >
                    {BUSINESS_UNITS.map((bu) => (
                      <MenuItem key={bu} value={bu}>{bu}</MenuItem>
                    ))}
                  </Select>
                  {errors.businessUnit && <FormHelperText>Business Unit is required</FormHelperText>}
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                {/* Placeholder for potential future field */}
                <Box sx={{ height: '56px' }} />
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
                Save Service
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddServicePage;
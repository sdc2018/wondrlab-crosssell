import React, { useState, useEffect } from 'react';
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
  SelectChangeEvent
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

// Mock data for dropdown options
const CATEGORIES = ['Digital', 'Creative', 'Marketing', 'Production', 'Technology', 'Strategy'];
const BUSINESS_UNITS = ['Content', 'Experiential Marketing', 'Video Production', 'Digital Media', 'Performance Marketing'];

// Mock service data (in a real app, this would be fetched from an API)
const mockServices = [
  {
    id: 1,
    name: 'Digital Marketing Strategy',
    description: 'Comprehensive digital marketing strategy development',
    businessUnit: 'Digital Media',
    category: 'Strategy',
    activeClients: 5,
    potentialClients: 8
  },
  {
    id: 2,
    name: 'Content Creation',
    description: 'High-quality content creation for various platforms',
    businessUnit: 'Content',
    category: 'Creative',
    activeClients: 7,
    potentialClients: 4
  },
  {
    id: 3,
    name: 'Social Media Management',
    description: 'Full-service social media management and strategy',
    businessUnit: 'Digital Media',
    category: 'Marketing',
    activeClients: 6,
    potentialClients: 5
  },
  {
    id: 4,
    name: 'Video Production',
    description: 'Professional video production services',
    businessUnit: 'Video Production',
    category: 'Production',
    activeClients: 4,
    potentialClients: 7
  },
  {
    id: 5,
    name: 'Event Management',
    description: 'End-to-end event planning and execution',
    businessUnit: 'Experiential Marketing',
    category: 'Marketing',
    activeClients: 3,
    potentialClients: 6
  }
];

const EditServicePage: React.FC = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    businessUnit: '',
    category: '',
  });
  const [errors, setErrors] = useState({
    name: false,
    businessUnit: false,
    category: false,
  });

  // Load service data on component mount
  useEffect(() => {
    if (serviceId) {
      // In a real app, this would be an API call
      const service = mockServices.find(s => s.id === parseInt(serviceId));
      if (service) {
        setFormData({
          name: service.name,
          description: service.description,
          businessUnit: service.businessUnit,
          category: service.category,
        });
      } else {
        // Service not found, redirect to services list
        navigate('/services');
      }
    }
  }, [serviceId, navigate]);

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
    navigate(`/services/${serviceId}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors = {
      name: !formData.name,
      businessUnit: !formData.businessUnit,
      category: !formData.category,
    };
    
    setErrors(newErrors);
    
    // If any errors, don't submit
    if (Object.values(newErrors).some(error => error)) {
      return;
    }
    
    // In a real app, this would save the updated service to the database
    console.log('Updating service:', formData);
    
    // Show success message and navigate back to service details
    alert('Service updated successfully!');
    navigate(`/services/${serviceId}`);
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
            Edit Service
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
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleSelectChange}
                  >
                    {CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth required error={errors.businessUnit}>
                  <InputLabel>Business Unit</InputLabel>
                  <Select
                    label="Business Unit"
                    name="businessUnit"
                    value={formData.businessUnit}
                    onChange={handleSelectChange}
                  >
                    {BUSINESS_UNITS.map((bu) => (
                      <MenuItem key={bu} value={bu}>{bu}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                {/* Empty box for alignment */}
              </Box>
            </Box>
            
            <Box sx={{ width: '100%' }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleTextChange}
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
                Save Changes
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EditServicePage;
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
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

// Mock data for dropdown options
const CLIENTS = [
  { id: 1, name: 'TechCorp' },
  { id: 2, name: 'Fashion Forward' },
  { id: 3, name: 'FoodDelights' },
  { id: 4, name: 'FinancePlus' },
  { id: 5, name: 'HealthFirst' }
];

const SERVICES = [
  { id: 1, name: 'Digital Marketing Strategy', businessUnitId: 2 },
  { id: 2, name: 'Content Creation', businessUnitId: 1 },
  { id: 3, name: 'Social Media Management', businessUnitId: 2 },
  { id: 4, name: 'Video Production', businessUnitId: 3 },
  { id: 5, name: 'Event Management', businessUnitId: 4 }
];

const BUSINESS_UNITS = [
  { id: 1, name: 'Content' },
  { id: 2, name: 'Digital Media' },
  { id: 3, name: 'Video Production' },
  { id: 4, name: 'Experiential Marketing' },
  { id: 5, name: 'Performance Marketing' }
];

const STATUSES = ['Identified', 'In Discussion', 'Proposal Sent', 'On Hold', 'Won', 'Lost', 'Cancelled'];
const PRIORITIES = ['High', 'Medium', 'Low'];

const USERS = [
  { id: 1, name: 'Alice Thompson' },
  { id: 2, name: 'Bob Richards' },
  { id: 3, name: 'Carol White' },
  { id: 4, name: 'David Miller' },
  { id: 5, name: 'Eva Garcia' }
];

const AddOpportunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientId: '',
    serviceId: '',
    businessUnitId: '',
    status: 'Identified',
    priority: 'Medium',
    assignedToUserId: '',
    expectedCloseDate: '',
    estimatedValue: '',
    description: ''
  });
  const [errors, setErrors] = useState({
    clientId: false,
    serviceId: false,
    businessUnitId: false,
    status: false,
    priority: false,
    assignedToUserId: false
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
    
    // Special handling for serviceId to auto-select businessUnitId
    if (name === 'serviceId' && value) {
      const service = SERVICES.find(s => s.id.toString() === value);
      if (service) {
        setFormData({
          ...formData,
          [name]: value,
          businessUnitId: service.businessUnitId.toString()
        });
      }
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

  const handleCancel = () => {
    navigate('/opportunities');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors = {
      clientId: !formData.clientId,
      serviceId: !formData.serviceId,
      businessUnitId: !formData.businessUnitId,
      status: !formData.status,
      priority: !formData.priority,
      assignedToUserId: !formData.assignedToUserId
    };
    
    setErrors(newErrors);
    
    // If any errors, don't submit
    if (Object.values(newErrors).some(error => error)) {
      return;
    }
    
    // In a real app, this would save the new opportunity to the database
    console.log('Submitting opportunity:', formData);
    
    // Show success message and navigate back to opportunities list
    alert('Opportunity added successfully!');
    navigate('/opportunities');
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
            Add New Opportunity
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth required error={errors.clientId}>
                  <InputLabel id="client-label">Client</InputLabel>
                  <Select
                    labelId="client-label"
                    name="clientId"
                    value={formData.clientId}
                    label="Client"
                    onChange={handleSelectChange}
                  >
                    {CLIENTS.map((client) => (
                      <MenuItem key={client.id} value={client.id.toString()}>{client.name}</MenuItem>
                    ))}
                  </Select>
                  {errors.clientId && <FormHelperText>Client is required</FormHelperText>}
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth required error={errors.serviceId}>
                  <InputLabel id="service-label">Service</InputLabel>
                  <Select
                    labelId="service-label"
                    name="serviceId"
                    value={formData.serviceId}
                    label="Service"
                    onChange={handleSelectChange}
                  >
                    {SERVICES.map((service) => (
                      <MenuItem key={service.id} value={service.id.toString()}>{service.name}</MenuItem>
                    ))}
                  </Select>
                  {errors.serviceId && <FormHelperText>Service is required</FormHelperText>}
                </FormControl>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth required error={errors.businessUnitId}>
                  <InputLabel id="bu-label">Business Unit</InputLabel>
                  <Select
                    labelId="bu-label"
                    name="businessUnitId"
                    value={formData.businessUnitId}
                    label="Business Unit"
                    onChange={handleSelectChange}
                    disabled={!formData.serviceId} // Disable until service is selected
                  >
                    {BUSINESS_UNITS.map((bu) => (
                      <MenuItem key={bu.id} value={bu.id.toString()}>{bu.name}</MenuItem>
                    ))}
                  </Select>
                  {errors.businessUnitId && <FormHelperText>Business Unit is required</FormHelperText>}
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth required error={errors.assignedToUserId}>
                  <InputLabel id="assigned-label">Assigned To</InputLabel>
                  <Select
                    labelId="assigned-label"
                    name="assignedToUserId"
                    value={formData.assignedToUserId}
                    label="Assigned To"
                    onChange={handleSelectChange}
                  >
                    {USERS.map((user) => (
                      <MenuItem key={user.id} value={user.id.toString()}>{user.name}</MenuItem>
                    ))}
                  </Select>
                  {errors.assignedToUserId && <FormHelperText>Assigned user is required</FormHelperText>}
                </FormControl>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth required error={errors.status}>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleSelectChange}
                  >
                    {STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                  {errors.status && <FormHelperText>Status is required</FormHelperText>}
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth required error={errors.priority}>
                  <InputLabel id="priority-label">Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    name="priority"
                    value={formData.priority}
                    label="Priority"
                    onChange={handleSelectChange}
                  >
                    {PRIORITIES.map((priority) => (
                      <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                    ))}
                  </Select>
                  {errors.priority && <FormHelperText>Priority is required</FormHelperText>}
                </FormControl>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <TextField
                  fullWidth
                    label="Expected Close Date"
                  name="expectedCloseDate"
                  type="date"
                    value={formData.expectedCloseDate}
                  onChange={handleTextChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  />
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <TextField
                  fullWidth
                  label="Estimated Value"
                  name="estimatedValue"
                  value={formData.estimatedValue}
                  onChange={handleTextChange}
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
            
            <Box sx={{ width: '100%' }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description/Notes"
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
                Save Opportunity
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddOpportunityPage;
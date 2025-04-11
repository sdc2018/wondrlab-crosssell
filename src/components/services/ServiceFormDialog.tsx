import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  SelectChangeEvent
} from '@mui/material';

// Interface for service
interface Service {
  id?: number;
  name: string;
  description: string;
  businessUnit: string;
  isActive: boolean;
}

// Interface for component props
interface ServiceFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (service: Service) => void;
  service?: Service | null;
  businessUnits: string[];
}

const ServiceFormDialog: React.FC<ServiceFormDialogProps> = ({
  open,
  onClose,
  onSave,
  service,
  businessUnits
}) => {
  // State for form data
  const [formData, setFormData] = useState<Service>({
    name: '',
    description: '',
    businessUnit: '',
    isActive: true
  });

  // State for validation
  const [errors, setErrors] = useState({
    name: false,
    description: false,
    businessUnit: false
  });

  // Update form data when service prop changes
  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      // Reset form for new service
      setFormData({
        name: '',
        description: '',
        businessUnit: '',
        isActive: true
      });
    }
  }, [service]);

  // Handle form field changes
  const handleChange = (field: keyof Service, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });

    // Clear validation error when field is updated
    if (field === 'name' || field === 'description' || field === 'businessUnit') {
      setErrors({
        ...errors,
        [field]: false
      });
    }
  };

  // Handle select changes
  const handleSelectChange = (event: SelectChangeEvent) => {
    handleChange('businessUnit', event.target.value);
  };

  // Handle switch change
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('isActive', event.target.checked);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors = {
      name: !formData.name.trim(),
      description: !formData.description.trim(),
      businessUnit: !formData.businessUnit
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  // Handle save
  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{service ? 'Edit Service' : 'Add New Service'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Service Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Service Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              error={errors.name}
              helperText={errors.name ? 'Service name is required' : ''}
              placeholder="Enter service name..."
            />
          </Grid>

          {/* Service Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              error={errors.description}
              helperText={errors.description ? 'Description is required' : ''}
              placeholder="Enter service description..."
              multiline
              rows={3}
            />
          </Grid>

          {/* Business Unit */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={errors.businessUnit}>
              <InputLabel id="business-unit-label">Business Unit</InputLabel>
              <Select
                labelId="business-unit-label"
                id="business-unit"
                value={formData.businessUnit}
                label="Business Unit"
                onChange={handleSelectChange}
              >
                <MenuItem value="">
                  <em>Select Business Unit</em>
                </MenuItem>
                {businessUnits.map((bu) => (
                  <MenuItem key={bu} value={bu}>
                    {bu}
                  </MenuItem>
                ))}
              </Select>
              {errors.businessUnit && (
                <p className="MuiFormHelperText-root Mui-error">Business Unit is required</p>
              )}
            </FormControl>
          </Grid>

          {/* Active Status */}
          <Grid item xs={12} sm={6}>
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
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {service ? 'Save Changes' : 'Add Service'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceFormDialog;

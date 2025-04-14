import React, { useState, useEffect } from 'react';
import {
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Switch,
  Box,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { Service } from '../../services/api/serviceService';
import businessUnitService, { BusinessUnit } from '../../services/api/businessUnitService';

interface ServiceFormProps {
  service?: Service | null;
  onSubmit: (formData: any) => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSubmit }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    AssociatedBU_ID: '',
    IsActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If service is provided, populate form with service data
    if (service) {
      setFormData({
        Name: service.Name || '',
        Description: service.Description || '',
        AssociatedBU_ID: service.AssociatedBU_ID || '',
        IsActive: service.IsActive !== undefined ? service.IsActive : true,
      });
    }
  }, [service]);

  useEffect(() => {
    // Fetch business units
    const fetchBusinessUnits = async () => {
      setLoading(true);
      try {
        const data = await businessUnitService.getAll();
        setBusinessUnits(data);
      } catch (err) {
        console.error('Error fetching business units:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessUnits();
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!formData.Name.trim()) {
      newErrors.Name = 'Name is required';
    }

    if (!formData.AssociatedBU_ID) {
      newErrors.AssociatedBU_ID = 'Business Unit is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Service Name"
            name="Name"
            value={formData.Name}
            onChange={handleTextChange}
            error={!!errors.Name}
            helperText={errors.Name}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="Description"
            value={formData.Description}
            onChange={handleTextChange}
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required error={!!errors.AssociatedBU_ID}>
            <InputLabel id="business-unit-label">Business Unit</InputLabel>
            {loading ? (
              <CircularProgress size={24} sx={{ mt: 2, ml: 2 }} />
            ) : (
              <Select
                labelId="business-unit-label"
                name="AssociatedBU_ID"
                value={formData.AssociatedBU_ID}
                onChange={handleSelectChange}
                label="Business Unit"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {businessUnits.map((bu) => (
                  <MenuItem key={bu.BU_ID} value={bu.BU_ID}>
                    {bu.Name}
                  </MenuItem>
                ))}
              </Select>
            )}
            {errors.AssociatedBU_ID && (
              <Box sx={{ color: 'error.main', mt: 1, ml: 2, fontSize: '0.75rem' }}>
                {errors.AssociatedBU_ID}
              </Box>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.IsActive}
                onChange={handleSwitchChange}
                name="IsActive"
                color="primary"
              />
            }
            label="Active"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ServiceForm;

import React, { useState, useEffect } from 'react';
import {
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Box,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { Client } from '../../services/api/clientService';
import businessUnitService, { BusinessUnit } from '../../services/api/businessUnitService';

// Mock data for users (account managers) - in a real app, this would come from an API
const mockUsers = [
  { UserID: '1', Name: 'John Doe' },
  { UserID: '2', Name: 'Jane Smith' },
  { UserID: '3', Name: 'Bob Johnson' },
];

// Mock data for industries - in a real app, this might come from an API or be defined as constants
const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Retail',
  'Manufacturing',
  'Education',
  'Media',
  'Other',
];

// Mock data for regions - in a real app, this might come from an API or be defined as constants
const regions = [
  'North America',
  'South America',
  'Europe',
  'Asia',
  'Africa',
  'Australia',
  'Global',
];

interface ClientFormProps {
  client?: Client | null;
  onSubmit: (formData: any) => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onSubmit }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Industry: '',
    Region: '',
    Address: '',
    PrimaryAccountManagerUserID: '',
    PrimaryBU_ID: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If client is provided, populate form with client data
    if (client) {
      setFormData({
        Name: client.Name || '',
        Industry: client.Industry || '',
        Region: client.Region || '',
        Address: client.Address || '',
        PrimaryAccountManagerUserID: client.PrimaryAccountManagerUserID || '',
        PrimaryBU_ID: client.PrimaryBU_ID || '',
      });
    }
  }, [client]);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!formData.Name.trim()) {
      newErrors.Name = 'Name is required';
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
            label="Client Name"
            name="Name"
            value={formData.Name}
            onChange={handleTextChange}
            error={!!errors.Name}
            helperText={errors.Name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="industry-label">Industry</InputLabel>
            <Select
              labelId="industry-label"
              name="Industry"
              value={formData.Industry}
              onChange={handleSelectChange}
              label="Industry"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {industries.map((industry) => (
                <MenuItem key={industry} value={industry}>
                  {industry}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="region-label">Region</InputLabel>
            <Select
              labelId="region-label"
              name="Region"
              value={formData.Region}
              onChange={handleSelectChange}
              label="Region"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {regions.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            name="Address"
            value={formData.Address}
            onChange={handleTextChange}
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="account-manager-label">Primary Account Manager</InputLabel>
            <Select
              labelId="account-manager-label"
              name="PrimaryAccountManagerUserID"
              value={formData.PrimaryAccountManagerUserID}
              onChange={handleSelectChange}
              label="Primary Account Manager"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {mockUsers.map((user) => (
                <MenuItem key={user.UserID} value={user.UserID}>
                  {user.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="business-unit-label">Primary Business Unit</InputLabel>
            {loading ? (
              <CircularProgress size={24} sx={{ mt: 2, ml: 2 }} />
            ) : (
              <Select
                labelId="business-unit-label"
                name="PrimaryBU_ID"
                value={formData.PrimaryBU_ID}
                onChange={handleSelectChange}
                label="Primary Business Unit"
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
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientForm;
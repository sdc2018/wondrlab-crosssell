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
  FormHelperText,
  Grid,
  FormControlLabel,
  Switch,
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import { User, UserRole, BusinessUnit, sampleBusinessUnits } from '../../data/sampleData';

interface UserFormProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSubmit: (user: User) => void;
}

const UserForm: React.FC<UserFormProps> = ({ open, user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    Username: '',
    Name: '',
    Email: '',
    Role: UserRole.SALES_EXECUTIVE,
    AssociatedBU_ID: '',
    IsActive: true
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  
  // Load business units
  useEffect(() => {
    // In a real app, this would be an API call
    setBusinessUnits(sampleBusinessUnits);
  }, []);
  
  // Initialize form with user data if editing
  useEffect(() => {
    if (user) {
      setFormData({
        UserID: user.UserID,
        Username: user.Username,
        Name: user.Name,
        Email: user.Email,
        Role: user.Role,
        AssociatedBU_ID: user.AssociatedBU_ID || '',
        IsActive: user.IsActive,
        CreatedAt: user.CreatedAt,
        UpdatedAt: user.UpdatedAt
      });
    } else {
      // Reset form for new user
      setFormData({
        Username: '',
        Name: '',
        Email: '',
        Role: UserRole.SALES_EXECUTIVE,
        AssociatedBU_ID: '',
        IsActive: true
      });
    }
    
    // Clear errors
    setErrors({});
  }, [user, open]);
  
  // Handle text field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle select field changes
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle switch field changes
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.Username?.trim()) {
      newErrors.Username = 'Username is required';
    }
    
    if (!formData.Name?.trim()) {
      newErrors.Name = 'Name is required';
    }
    
    if (!formData.Email?.trim()) {
      newErrors.Email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      newErrors.Email = 'Email is invalid';
    }
    
    if (!formData.Role) {
      newErrors.Role = 'Role is required';
    }
    
    // BU Head must have an associated BU
    if (formData.Role === UserRole.BU_HEAD && !formData.AssociatedBU_ID) {
      newErrors.AssociatedBU_ID = 'Business Unit is required for BU Head';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a complete user object
      const userData: User = {
        UserID: formData.UserID || 'temp-id', // Will be replaced in parent component for new users
        Username: formData.Username!,
        Name: formData.Name!,
        Email: formData.Email!,
        Role: formData.Role!,
        AssociatedBU_ID: formData.AssociatedBU_ID || undefined,
        IsActive: formData.IsActive!,
        CreatedAt: formData.CreatedAt || new Date(),
        UpdatedAt: new Date()
      };
      
      onSubmit(userData);
    } catch (error) {
      console.error('Error submitting user form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
      
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Username"
              name="Username"
              value={formData.Username}
              onChange={handleChange}
              error={!!errors.Username}
              helperText={errors.Username}
              disabled={isSubmitting}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              error={!!errors.Name}
              helperText={errors.Name}
              disabled={isSubmitting}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="Email"
              type="email"
              value={formData.Email}
              onChange={handleChange}
              error={!!errors.Email}
              helperText={errors.Email}
              disabled={isSubmitting}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.Role} required>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="Role"
                value={formData.Role || ''}
                onChange={handleSelectChange}
                label="Role"
                disabled={isSubmitting}
              >
                {Object.values(UserRole).map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
              {errors.Role && <FormHelperText>{errors.Role}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl 
              fullWidth 
              error={!!errors.AssociatedBU_ID}
              disabled={formData.Role !== UserRole.BU_HEAD || isSubmitting}
            >
              <InputLabel id="bu-label">Business Unit</InputLabel>
              <Select
                labelId="bu-label"
                id="AssociatedBU_ID"
                name="AssociatedBU_ID"
                value={formData.AssociatedBU_ID || ''}
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
              {errors.AssociatedBU_ID && (
                <FormHelperText>{errors.AssociatedBU_ID}</FormHelperText>
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
                  disabled={isSubmitting}
                />
              }
              label="Active"
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;

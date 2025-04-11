import React from 'react';
import { 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  Button,
  Box
} from '@mui/material';

// Mock data for filter options
const INDUSTRIES = ['Technology', 'Fashion', 'Food & Beverage', 'Finance', 'Healthcare', 'Retail'];
const REGIONS = ['North', 'South', 'East', 'West', 'Central'];
const BUSINESS_UNITS = ['Content', 'Experiential Marketing', 'Video Production', 'Digital Media', 'Performance Marketing'];

interface ClientFilterProps {
  filters: {
    industry: string;
    region: string;
    primaryBU: string;
  };
  onFilterChange: (name: string, value: string) => void;
}

const ClientFilter: React.FC<ClientFilterProps> = ({ filters, onFilterChange }) => {
  const handleChange = (event: SelectChangeEvent) => {
    onFilterChange(event.target.name, event.target.value);
  };

  const handleClearFilters = () => {
    onFilterChange('industry', '');
    onFilterChange('region', '');
    onFilterChange('primaryBU', '');
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid component="div" item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="industry-filter-label">Industry</InputLabel>
            <Select
              labelId="industry-filter-label"
              id="industry-filter"
              name="industry"
              value={filters.industry}
              label="Industry"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>All Industries</em>
              </MenuItem>
              {INDUSTRIES.map((industry) => (
                <MenuItem key={industry} value={industry}>
                  {industry}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid component="div" item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="region-filter-label">Region</InputLabel>
            <Select
              labelId="region-filter-label"
              id="region-filter"
              name="region"
              value={filters.region}
              label="Region"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>All Regions</em>
              </MenuItem>
              {REGIONS.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid component="div" item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="bu-filter-label">Business Unit</InputLabel>
            <Select
              labelId="bu-filter-label"
              id="bu-filter"
              name="primaryBU"
              value={filters.primaryBU}
              label="Business Unit"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>All Business Units</em>
              </MenuItem>
              {BUSINESS_UNITS.map((bu) => (
                <MenuItem key={bu} value={bu}>
                  {bu}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid component="div" item xs={12} sm={6} md={3}>
          <Button 
            variant="outlined" 
            onClick={handleClearFilters}
            fullWidth
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientFilter;

import React from 'react';
import { 
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
    businessUnit: string;
    status: string;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
}

const ClientFilter: React.FC<ClientFilterProps> = ({ 
  filters, 
  onFilterChange, 
  onClearFilters 
}) => {
  const handleChange = (event: SelectChangeEvent<string>, field: string) => {
    onFilterChange({ ...filters, [field]: event.target.value });
  };

  const handleClearFilters = () => {
    onClearFilters();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flexBasis: { xs: '100%', sm: '47%', md: '23%' } }}>
          <FormControl fullWidth size="small">
            <InputLabel id="industry-filter-label">Industry</InputLabel>
            <Select
              labelId="industry-filter-label"
              value={filters.industry}
              label="Industry"
              onChange={(e) => handleChange(e, 'industry')}
            >
              <MenuItem value="">All</MenuItem>
              {INDUSTRIES.map((industry) => (
                <MenuItem key={industry} value={industry}>{industry}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ flexBasis: { xs: '100%', sm: '47%', md: '23%' } }}>
          <FormControl fullWidth size="small">
            <InputLabel id="region-filter-label">Region</InputLabel>
            <Select
              labelId="region-filter-label"
              value={filters.region}
              label="Region"
              onChange={(e) => handleChange(e, 'region')}
            >
              <MenuItem value="">All</MenuItem>
              {REGIONS.map((region) => (
                <MenuItem key={region} value={region}>{region}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ flexBasis: { xs: '100%', sm: '47%', md: '23%' } }}>
          <FormControl fullWidth size="small">
            <InputLabel id="bu-filter-label">Business Unit</InputLabel>
            <Select
              labelId="bu-filter-label"
              value={filters.businessUnit}
              label="Business Unit"
              onChange={(e) => handleChange(e, 'businessUnit')}
            >
              <MenuItem value="">All</MenuItem>
              {BUSINESS_UNITS.map((bu) => (
                <MenuItem key={bu} value={bu}>{bu}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ flexBasis: { xs: '100%', sm: '47%', md: '23%' } }}>
          <Button 
            variant="outlined" 
            onClick={handleClearFilters}
            fullWidth
          >
            Clear Filters
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientFilter;
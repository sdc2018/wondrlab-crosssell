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
const SERVICES = ['Digital Marketing Strategy', 'Content Creation', 'Social Media Management', 'Video Production', 'Event Management'];
const REGIONS = ['North', 'South', 'East', 'West', 'Central'];

interface BusinessUnitFilterProps {
  filters: {
    services: string;
    region: string;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
}

const BusinessUnitFilter: React.FC<BusinessUnitFilterProps> = ({ 
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
        <Box sx={{ flexBasis: { xs: '100%', sm: '47%', md: '30%' } }}>
          <FormControl fullWidth size="small">
            <InputLabel id="services-filter-label">Services</InputLabel>
            <Select
              labelId="services-filter-label"
              value={filters.services}
              label="Services"
              onChange={(e) => handleChange(e, 'services')}
            >
              <MenuItem value="">All</MenuItem>
              {SERVICES.map((service) => (
                <MenuItem key={service} value={service}>{service}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ flexBasis: { xs: '100%', sm: '47%', md: '30%' } }}>
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
        
        <Box sx={{ flexBasis: { xs: '100%', sm: '47%', md: '30%' } }}>
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

export default BusinessUnitFilter;

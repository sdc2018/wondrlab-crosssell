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
const CATEGORIES = ['Digital', 'Creative', 'Marketing', 'Production', 'Technology', 'Strategy'];
const BUSINESS_UNITS = ['Content', 'Experiential Marketing', 'Video Production', 'Digital Media', 'Performance Marketing'];

interface ServiceFilterProps {
  filters: {
    businessUnit: string;
    category: string;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
}

const ServiceFilter: React.FC<ServiceFilterProps> = ({ 
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
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              value={filters.category}
              label="Category"
              onChange={(e) => handleChange(e, 'category')}
            >
              <MenuItem value="">All</MenuItem>
              {CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ flexBasis: { xs: '100%', sm: '47%', md: '30%' } }}>
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

export default ServiceFilter;

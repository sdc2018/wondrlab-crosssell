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
const STATUSES = ['Identified', 'In Discussion', 'Proposal Sent', 'On Hold', 'Won', 'Lost', 'Cancelled'];
const PRIORITIES = ['High', 'Medium', 'Low'];
const BUSINESS_UNITS = ['Content', 'Experiential Marketing', 'Video Production', 'Digital Media', 'Performance Marketing'];

interface OpportunityFilterProps {
  filters: {
    client: string;
    service: string;
    businessUnit: string;
    status: string;
    priority: string;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
}

const OpportunityFilter: React.FC<OpportunityFilterProps> = ({ 
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
        <Box sx={{ flexBasis: { xs: '100%', sm: '47%', md: '19%' } }}>
          <FormControl fullWidth size="small">
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={filters.status}
              label="Status"
              onChange={(e) => handleChange(e, 'status')}
            >
              <MenuItem value="">All</MenuItem>
              {STATUSES.map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ flexBasis: { xs: '100%', sm: '47%', md: '19%' } }}>
          <FormControl fullWidth size="small">
            <InputLabel id="priority-filter-label">Priority</InputLabel>
            <Select
              labelId="priority-filter-label"
              value={filters.priority}
              label="Priority"
              onChange={(e) => handleChange(e, 'priority')}
            >
              <MenuItem value="">All</MenuItem>
              {PRIORITIES.map((priority) => (
                <MenuItem key={priority} value={priority}>{priority}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ flexBasis: { xs: '100%', sm: '47%', md: '19%' } }}>
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
        
        <Box sx={{ flexBasis: { xs: '100%', sm: '47%', md: '19%' } }}>
          <FormControl fullWidth size="small">
            <InputLabel id="client-filter-label">Client</InputLabel>
            <Select
              labelId="client-filter-label"
              value={filters.client}
              label="Client"
              onChange={(e) => handleChange(e, 'client')}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="1">TechCorp</MenuItem>
              <MenuItem value="2">Fashion Forward</MenuItem>
              <MenuItem value="3">FoodDelights</MenuItem>
              <MenuItem value="4">FinancePlus</MenuItem>
              <MenuItem value="5">HealthFirst</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ flexBasis: { xs: '100%', sm: '47%', md: '19%' } }}>
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

export default OpportunityFilter;

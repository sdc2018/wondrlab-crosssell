import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  InputAdornment,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { CSVLink } from 'react-csv';
import ClientList from '../../components/clients/ClientList';
import ClientFilter from '../../components/clients/ClientFilter';

// Mock data for clients
const mockClients = [
  {
    id: 1,
    name: 'TechCorp',
    industry: 'Technology',
    region: 'North',
    primaryAccountManager: 'John Smith',
    primaryBU: 'Content',
    activeServices: 2,
    potentialServices: 5
  },
  {
    id: 2,
    name: 'Fashion Forward',
    industry: 'Fashion',
    region: 'West',
    primaryAccountManager: 'Sarah Johnson',
    primaryBU: 'Experiential Marketing',
    activeServices: 1,
    potentialServices: 6
  },
  {
    id: 3,
    name: 'Food Delights',
    industry: 'Food & Beverage',
    region: 'South',
    primaryAccountManager: 'John Smith',
    primaryBU: 'Content',
    activeServices: 1,
    potentialServices: 6
  },
  {
    id: 4,
    name: 'Finance Plus',
    industry: 'Finance',
    region: 'East',
    primaryAccountManager: 'Sarah Johnson',
    primaryBU: 'Experiential Marketing',
    activeServices: 1,
    potentialServices: 6
  }
];

// CSV headers for export
const csvHeaders = [
  { label: 'Client ID', key: 'id' },
  { label: 'Name', key: 'name' },
  { label: 'Industry', key: 'industry' },
  { label: 'Region', key: 'region' },
  { label: 'Primary Account Manager', key: 'primaryAccountManager' },
  { label: 'Primary Business Unit', key: 'primaryBU' },
  { label: 'Active Services', key: 'activeServices' },
  { label: 'Potential Services', key: 'potentialServices' }
];

const ClientListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    industry: '',
    region: '',
    primaryBU: ''
  });

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle filter menu open
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  // Handle filter menu close
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Toggle filter panel
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
    handleFilterClose();
  };

  // Handle filter changes
  const handleFilterChange = (name: string, value: string) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Handle file import
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real application, we would process the file here
      // For now, just show an alert
      alert(`File "${file.name}" selected for import. This would be processed in a real application.`);
    }
  };

  // Filter clients based on search term and filters
  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = filters.industry === '' || client.industry === filters.industry;
    const matchesRegion = filters.region === '' || client.region === filters.region;
    const matchesBU = filters.primaryBU === '' || client.primaryBU === filters.primaryBU;
    
    return matchesSearch && matchesIndustry && matchesRegion && matchesBU;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Client Management</Typography>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            sx={{ mr: 1 }}
          >
            Add Client
          </Button>
          
          {/* Import Button with hidden file input */}
          <input
            accept=".csv,.xlsx"
            id="import-file"
            type="file"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
          <label htmlFor="import-file">
            <Button 
              variant="outlined" 
              component="span"
              startIcon={<UploadIcon />}
              sx={{ mr: 1 }}
            >
              Import
            </Button>
          </label>
          
          {/* Export Button with CSVLink */}
          <CSVLink 
            data={filteredClients} 
            headers={csvHeaders}
            filename={"wondrlab-clients.csv"}
            style={{ textDecoration: 'none' }}
          >
            <Button 
              variant="outlined" 
              startIcon={<DownloadIcon />}
            >
              Export
            </Button>
          </CSVLink>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid component="div" item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search clients..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid component="div" item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Tooltip title="Filter clients">
              <IconButton onClick={handleFilterClick}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
            >
              <MenuItem onClick={handleToggleFilters}>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
        
        {showFilters && (
          <Box sx={{ mt: 2 }}>
            <ClientFilter 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </Box>
        )}
      </Paper>
      
      <ClientList clients={filteredClients} />
    </Box>
  );
};

export default ClientListPage;

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  InputAdornment,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { CSVLink } from 'react-csv';
import ServiceList from '../../components/services/ServiceList';
import ServiceFilter from '../../components/services/ServiceFilter';
import { useServices } from '../../contexts/ServicesContext';

const ServiceListPage: React.FC = () => {
  const navigate = useNavigate();
  const { services } = useServices(); // Use the services context instead of static mock data
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    businessUnit: '',
    category: ''
  });
  const [addMenuAnchorEl, setAddMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [exportMenuAnchorEl, setExportMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [importMenuAnchorEl, setImportMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterClick = () => {
    setShowFilters(!showFilters);
  };

  const handleAddClick = (event: React.MouseEvent<HTMLElement>) => {
    setAddMenuAnchorEl(event.currentTarget);
  };

  const handleAddClose = () => {
    setAddMenuAnchorEl(null);
  };

  const handleAddNewService = () => {
    handleAddClose();
    navigate('/services/new');
  };

  const handleAddFromTemplate = () => {
    handleAddClose();
    // Future functionality
    alert('Add from template functionality will be implemented in a future release');
  };

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportMenuAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportMenuAnchorEl(null);
  };

  const handleImportClick = (event: React.MouseEvent<HTMLElement>) => {
    setImportMenuAnchorEl(event.currentTarget);
  };

  const handleImportClose = () => {
    setImportMenuAnchorEl(null);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      businessUnit: '',
      category: ''
    });
  };

  // Filter services based on search term and filters
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.businessUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBU = !filters.businessUnit || service.businessUnit === filters.businessUnit;
    const matchesCategory = !filters.category || service.category === filters.category;
    
    return matchesSearch && matchesBU && matchesCategory;
  });

  // Prepare data for CSV export
  const exportData = filteredServices.map(service => ({
    ID: service.id,
    Name: service.name,
    Description: service.description,
    'Business Unit': service.businessUnit,
    Category: service.category,
    'Active Clients': service.activeClients,
    'Potential Clients': service.potentialClients
  }));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Services</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add
          </Button>
          <Menu
            anchorEl={addMenuAnchorEl}
            open={Boolean(addMenuAnchorEl)}
            onClose={handleAddClose}
          >
            <MenuItem onClick={handleAddNewService}>Add New Service</MenuItem>
            <MenuItem onClick={handleAddFromTemplate}>Add From Template</MenuItem>
          </Menu>
          
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={handleExportClick}
          >
            Export
          </Button>
          <Menu
            anchorEl={exportMenuAnchorEl}
            open={Boolean(exportMenuAnchorEl)}
            onClose={handleExportClose}
          >
            <MenuItem onClick={handleExportClose}>
              <CSVLink 
                data={exportData} 
                filename={"services.csv"}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Export as CSV
              </CSVLink>
            </MenuItem>
            <MenuItem onClick={handleExportClose}>Export as Excel</MenuItem>
            <MenuItem onClick={handleExportClose}>Export as PDF</MenuItem>
          </Menu>
          
          <Button 
            variant="outlined" 
            startIcon={<UploadIcon />}
            onClick={handleImportClick}
          >
            Import
          </Button>
          <Menu
            anchorEl={importMenuAnchorEl}
            open={Boolean(importMenuAnchorEl)}
            onClose={handleImportClose}
          >
            <MenuItem onClick={handleImportClose}>Import from CSV</MenuItem>
            <MenuItem onClick={handleImportClose}>Import from Excel</MenuItem>
          </Menu>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', md: '60%' } }}>
            <TextField
              fullWidth
              placeholder="Search services..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, flexBasis: { xs: '100%', md: '35%' } }}>
            <Tooltip title="Filter services">
              <IconButton onClick={handleFilterClick}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <Button 
              variant={showFilters ? "contained" : "outlined"} 
              onClick={handleFilterClick}
              size="small"
              sx={{ ml: 1 }}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </Box>
        </Box>
        
        {showFilters && (
          <Box sx={{ mt: 2 }}>
            <ServiceFilter 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </Box>
        )}
      </Paper>
      
      <ServiceList services={filteredServices} />
    </Box>
  );
};

export default ServiceListPage;
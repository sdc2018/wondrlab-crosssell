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
import BusinessUnitList from '../../components/business-units/BusinessUnitList';
import BusinessUnitFilter from '../../components/business-units/BusinessUnitFilter';
import { useBusinessUnits } from '../../contexts/BusinessUnitsContext';

const BusinessUnitListPage: React.FC = () => {
  const navigate = useNavigate();
  const { businessUnits } = useBusinessUnits(); // Use the business units context
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    services: '',
    region: ''
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

  const handleAddNewBusinessUnit = () => {
    handleAddClose();
    navigate('/business-units/new');
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
      services: '',
      region: ''
    });
  };

  // Filter business units based on search term and filters
  const filteredBusinessUnits = businessUnits.filter(businessUnit => {
    const matchesSearch = businessUnit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      businessUnit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      businessUnit.headName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For this MVP, we're not actually filtering by services or region
    // In a real implementation, we would need to add these fields to the BusinessUnit interface
    // and implement the filtering logic
    
    return matchesSearch;
  });

  // Prepare data for CSV export
  const exportData = filteredBusinessUnits.map(businessUnit => ({
    ID: businessUnit.id,
    Name: businessUnit.name,
    Description: businessUnit.description,
    'Head Name': businessUnit.headName,
    'Head Email': businessUnit.headEmail,
    'Services': businessUnit.services,
    'Active Clients': businessUnit.activeClients
  }));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Business Units</Typography>
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
            <MenuItem onClick={handleAddNewBusinessUnit}>Add New Business Unit</MenuItem>
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
                filename={"business-units.csv"}
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
              placeholder="Search business units..."
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
            <Tooltip title="Filter business units">
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
            <BusinessUnitFilter 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </Box>
        )}
      </Paper>
      
      <BusinessUnitList businessUnits={filteredBusinessUnits} />
    </Box>
  );
};

export default BusinessUnitListPage;

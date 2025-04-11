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
import ClientList from '../../components/clients/ClientList';
import ClientFilter from '../../components/clients/ClientFilter';

// Mock data for clients
const mockClients = [
  {
    id: 1,
    name: 'TechCorp',
    industry: 'Technology',
    region: 'North',
    primaryBU: 'Digital Media',
    primaryContact: 'John Smith',
    email: 'john@techcorp.com',
    phone: '555-1234',
    activeServices: 3,
    totalOpportunities: 5,
    primaryAccountManager: 'Alice Thompson',
    potentialServices: 3
  },
  {
    id: 2,
    name: 'Fashion Forward',
    industry: 'Fashion',
    region: 'South',
    primaryBU: 'Content',
    primaryContact: 'Emma Johnson',
    email: 'emma@fashionforward.com',
    phone: '555-5678',
    activeServices: 2,
    totalOpportunities: 4,
    primaryAccountManager: 'Bob Richards',
    potentialServices: 2
  },
  {
    id: 3,
    name: 'FoodDelights',
    industry: 'Food & Beverage',
    region: 'Central',
    primaryBU: 'Experiential Marketing',
    primaryContact: 'Michael Brown',
    email: 'michael@fooddelights.com',
    phone: '555-9012',
    activeServices: 1,
    totalOpportunities: 3,
    primaryAccountManager: 'Carol White',
    potentialServices: 2
  },
  {
    id: 4,
    name: 'FinancePlus',
    industry: 'Finance',
    region: 'East',
    primaryBU: 'Performance Marketing',
    primaryContact: 'Sarah Wilson',
    email: 'sarah@financeplus.com',
    phone: '555-3456',
    activeServices: 4,
    totalOpportunities: 2,
    primaryAccountManager: 'David Miller',
    potentialServices: 2
  },
  {
    id: 5,
    name: 'HealthFirst',
    industry: 'Healthcare',
    region: 'West',
    primaryBU: 'Video Production',
    primaryContact: 'David Lee',
    email: 'david@healthfirst.com',
    phone: '555-7890',
    activeServices: 2,
    totalOpportunities: 6,
    primaryAccountManager: 'Eva Garcia',
    potentialServices: 2
  }
];

const ClientListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    industry: '',
    region: '',
    businessUnit: '',
    status: ''
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

  const handleAddNewClient = () => {
    handleAddClose();
    navigate('/clients/new');
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
      industry: '',
      region: '',
      businessUnit: '',
      status: ''
    });
  };

  // Filter clients based on search term and filters
  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.primaryBU.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.primaryContact.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = !filters.industry || client.industry === filters.industry;
    const matchesRegion = !filters.region || client.region === filters.region;
    const matchesBU = !filters.businessUnit || client.primaryBU === filters.businessUnit;
    
    return matchesSearch && matchesIndustry && matchesRegion && matchesBU;
  });

  // Prepare data for CSV export
  const exportData = filteredClients.map(client => ({
    ID: client.id,
    Name: client.name,
    Industry: client.industry,
    Region: client.region,
    'Primary BU': client.primaryBU,
    'Primary Contact': client.primaryContact,
    Email: client.email,
    Phone: client.phone,
    'Active Services': client.activeServices,
    'Total Opportunities': client.totalOpportunities
  }));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Clients</Typography>
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
            <MenuItem onClick={handleAddNewClient}>Add New Client</MenuItem>
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
                filename={"clients.csv"}
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
              size="small"
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, flexBasis: { xs: '100%', md: '35%' } }}>
            <Tooltip title="Filter clients">
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
            <ClientFilter 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </Box>
        )}
      </Paper>
      
      <ClientList clients={filteredClients} />
    </Box>
  );
};

export default ClientListPage;
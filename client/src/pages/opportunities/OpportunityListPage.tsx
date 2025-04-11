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
import OpportunityList from '../../components/opportunities/OpportunityList';
import OpportunityFilter from '../../components/opportunities/OpportunityFilter';

// Mock data for opportunities
const mockOpportunities = [
  {
    id: 1,
    clientId: 1,
    clientName: 'TechCorp',
    serviceId: 3,
    serviceName: 'Social Media Management',
    status: 'In Discussion' as const,
    priority: 'High' as const,
    assignedToUserId: 2,
    assignedToUserName: 'Bob Richards',
    createdDate: '2023-05-15',
    expectedCloseDate: '2023-07-30',
    estimatedValue: 15000,
    businessUnitId: 2,
    businessUnitName: 'Digital Media'
  },
  {
    id: 2,
    clientId: 3,
    clientName: 'FoodDelights',
    serviceId: 4,
    serviceName: 'Video Production',
    status: 'Proposal Sent' as const,
    priority: 'Medium' as const,
    assignedToUserId: 3,
    assignedToUserName: 'Carol White',
    createdDate: '2023-06-02',
    expectedCloseDate: '2023-08-15',
    estimatedValue: 25000,
    businessUnitId: 3,
    businessUnitName: 'Video Production'
  },
  {
    id: 3,
    clientId: 2,
    clientName: 'Fashion Forward',
    serviceId: 1,
    serviceName: 'Digital Marketing Strategy',
    status: 'Won' as const,
    priority: 'High' as const,
    assignedToUserId: 1,
    assignedToUserName: 'Alice Thompson',
    createdDate: '2023-04-10',
    expectedCloseDate: '2023-06-15',
    estimatedValue: 30000,
    businessUnitId: 2,
    businessUnitName: 'Digital Media'
  },
  {
    id: 4,
    clientId: 5,
    clientName: 'HealthFirst',
    serviceId: 2,
    serviceName: 'Content Creation',
    status: 'Identified' as const,
    priority: 'Low' as const,
    assignedToUserId: 4,
    assignedToUserName: 'David Miller',
    createdDate: '2023-06-20',
    expectedCloseDate: '2023-09-01',
    estimatedValue: 12000,
    businessUnitId: 1,
    businessUnitName: 'Content'
  },
  {
    id: 5,
    clientId: 4,
    clientName: 'FinancePlus',
    serviceId: 5,
    serviceName: 'Event Management',
    status: 'On Hold' as const,
    priority: 'Medium' as const,
    assignedToUserId: 5,
    assignedToUserName: 'Eva Garcia',
    createdDate: '2023-05-05',
    expectedCloseDate: '2023-08-10',
    estimatedValue: 20000,
    businessUnitId: 4,
    businessUnitName: 'Experiential Marketing'
  },
  {
    id: 6,
    clientId: 1,
    clientName: 'TechCorp',
    serviceId: 2,
    serviceName: 'Content Creation',
    status: 'Lost' as const,
    priority: 'High' as const,
    assignedToUserId: 2,
    assignedToUserName: 'Bob Richards',
    createdDate: '2023-03-15',
    expectedCloseDate: '2023-05-30',
    estimatedValue: 18000,
    businessUnitId: 1,
    businessUnitName: 'Content'
  }
];

const OpportunityListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    client: '',
    service: '',
    businessUnit: '',
    status: '',
    priority: ''
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

  const handleAddNewOpportunity = () => {
    handleAddClose();
    navigate('/opportunities/new');
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
      client: '',
      service: '',
      businessUnit: '',
      status: '',
      priority: ''
    });
  };

  // Filter opportunities based on search term and filters
  const filteredOpportunities = mockOpportunities.filter(opportunity => {
    const matchesSearch = 
      opportunity.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.businessUnitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.assignedToUserName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClient = !filters.client || opportunity.clientId.toString() === filters.client;
    const matchesService = !filters.service || opportunity.serviceId.toString() === filters.service;
    const matchesBU = !filters.businessUnit || opportunity.businessUnitName === filters.businessUnit;
    const matchesStatus = !filters.status || opportunity.status === filters.status;
    const matchesPriority = !filters.priority || opportunity.priority === filters.priority;
    
    return matchesSearch && matchesClient && matchesService && matchesBU && matchesStatus && matchesPriority;
  });

  // Prepare data for CSV export
  const exportData = filteredOpportunities.map(opportunity => ({
    ID: opportunity.id,
    Client: opportunity.clientName,
    Service: opportunity.serviceName,
    'Business Unit': opportunity.businessUnitName,
    Status: opportunity.status,
    Priority: opportunity.priority,
    'Assigned To': opportunity.assignedToUserName,
    'Created Date': opportunity.createdDate,
    'Expected Close Date': opportunity.expectedCloseDate,
    'Estimated Value': opportunity.estimatedValue
  }));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Opportunities</Typography>
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
            <MenuItem onClick={handleAddNewOpportunity}>Add New Opportunity</MenuItem>
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
                filename={"opportunities.csv"}
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
              placeholder="Search opportunities..."
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
            <Tooltip title="Filter opportunities">
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
            <OpportunityFilter 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </Box>
        )}
      </Paper>
      
      <OpportunityList opportunities={filteredOpportunities} />
    </Box>
  );
};

export default OpportunityListPage;

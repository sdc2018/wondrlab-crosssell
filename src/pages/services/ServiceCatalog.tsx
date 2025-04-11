import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { CSVLink } from 'react-csv';
import ServiceFormDialog from '../../components/services/ServiceFormDialog';

// Interface for service
interface Service {
  id: number;
  name: string;
  description: string;
  businessUnit: string;
  isActive: boolean;
}

// Mock data for business units
const mockBusinessUnits = [
  'Content',
  'Experiential Marketing',
  'Video Production',
  'Digital Media',
  'Performance Marketing'
];

// Mock data for services
const mockServices: Service[] = [
  {
    id: 1,
    name: 'Content Strategy',
    description: 'Develop comprehensive content strategy aligned with business goals',
    businessUnit: 'Content',
    isActive: true
  },
  {
    id: 2,
    name: 'Video Production',
    description: 'Professional video production services for marketing and communication',
    businessUnit: 'Video Production',
    isActive: true
  },
  {
    id: 3,
    name: 'Digital Marketing',
    description: 'Full-service digital marketing including SEO, SEM, and social media',
    businessUnit: 'Digital Media',
    isActive: true
  },
  {
    id: 4,
    name: 'Event Management',
    description: 'End-to-end event planning, execution, and management',
    businessUnit: 'Experiential Marketing',
    isActive: true
  },
  {
    id: 5,
    name: 'Performance Marketing',
    description: 'Data-driven marketing focused on measurable results and ROI',
    businessUnit: 'Performance Marketing',
    isActive: true
  }
];

const ServiceCatalog: React.FC = () => {
  // State for services
  const [services, setServices] = useState<Service[]>(mockServices);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBU, setSelectedBU] = useState<string>('');
  const [showInactive, setShowInactive] = useState(false);
  
  // State for service form dialog
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Handle business unit filter change
  const handleBUFilterChange = (event: SelectChangeEvent) => {
    setSelectedBU(event.target.value);
  };
  
  // Handle show inactive toggle
  const handleShowInactiveToggle = () => {
    setShowInactive(!showInactive);
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedBU('');
    setShowInactive(false);
  };
  
  // Handle open service dialog for add
  const handleOpenAddServiceDialog = () => {
    setSelectedService(null);
    setOpenServiceDialog(true);
  };
  
  // Handle open service dialog for edit
  const handleOpenEditServiceDialog = (service: Service) => {
    setSelectedService(service);
    setOpenServiceDialog(true);
  };
  
  // Handle close service dialog
  const handleCloseServiceDialog = () => {
    setOpenServiceDialog(false);
    setSelectedService(null);
  };
  
  // Handle save service
  const handleSaveService = (serviceData: Service) => {
    if (selectedService) {
      // Update existing service
      const updatedServices = services.map(service => 
        service.id === selectedService.id ? { ...serviceData, id: service.id } : service
      );
      setServices(updatedServices);
    } else {
      // Add new service
      const newService: Service = {
        id: Math.max(...services.map(s => s.id)) + 1,
        ...serviceData
      };
      setServices([...services, newService]);
    }
  };
  
  // Handle toggle service active status
  const handleToggleServiceActive = (id: number) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, isActive: !service.isActive } : service
    ));
  };
  
  // Handle file import
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real application, we would process the file here
      alert(`File "${file.name}" selected for import. This would be processed in a real application.`);
    }
  };
  
  // Filter services based on search term and filters
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBU = selectedBU === '' || service.businessUnit === selectedBU;
    const matchesActive = showInactive || service.isActive;
    
    return matchesSearch && matchesBU && matchesActive;
  });
  
  // Group services by business unit
  const servicesByBU = filteredServices.reduce((acc, service) => {
    if (!acc[service.businessUnit]) {
      acc[service.businessUnit] = [];
    }
    acc[service.businessUnit].push(service);
    return acc;
  }, {} as Record<string, Service[]>);
  
  // Prepare CSV data for export
  const exportData = services.map(service => ({
    ID: service.id,
    Name: service.name,
    Description: service.description,
    'Business Unit': service.businessUnit,
    Status: service.isActive ? 'Active' : 'Inactive'
  }));
  
  // CSV headers for export
  const csvHeaders = [
    { label: 'ID', key: 'ID' },
    { label: 'Name', key: 'Name' },
    { label: 'Description', key: 'Description' },
    { label: 'Business Unit', key: 'Business Unit' },
    { label: 'Status', key: 'Status' }
  ];
  
  return (
    <Box>
      {/* Header with title and actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Service Catalog</Typography>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleOpenAddServiceDialog}
            sx={{ mr: 1 }}
          >
            Add Service
          </Button>
          
          {/* Import Button with hidden file input */}
          <input
            accept=".csv,.xlsx"
            id="import-services"
            type="file"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
          <label htmlFor="import-services">
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
            data={exportData} 
            headers={csvHeaders}
            filename={"wondrlab-services.csv"}
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
      
      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
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
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <FormControl sx={{ minWidth: 200, mr: 2 }}>
                <InputLabel id="bu-filter-label">Business Unit</InputLabel>
                <Select
                  labelId="bu-filter-label"
                  id="bu-filter"
                  value={selectedBU}
                  label="Business Unit"
                  onChange={handleBUFilterChange}
                >
                  <MenuItem value="">
                    <em>All Business Units</em>
                  </MenuItem>
                  {mockBusinessUnits.map((bu) => (
                    <MenuItem key={bu} value={bu}>
                      {bu}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button 
                variant="outlined" 
                onClick={handleShowInactiveToggle}
                sx={{ mr: 2 }}
              >
                {showInactive ? 'Hide Inactive' : 'Show Inactive'}
              </Button>
              <Button 
                variant="text" 
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Services by Business Unit */}
      {Object.keys(servicesByBU).length > 0 ? (
        Object.entries(servicesByBU).map(([bu, buServices]) => (
          <Box key={bu} sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>{bu}</Typography>
            <Grid container spacing={3}>
              {buServices.map((service) => (
                <Grid item xs={12} sm={6} md={4} key={service.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      opacity: service.isActive ? 1 : 0.7
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6" component="div">
                          {service.name}
                        </Typography>
                        <Chip 
                          label={service.isActive ? 'Active' : 'Inactive'} 
                          color={service.isActive ? 'success' : 'default'} 
                          size="small" 
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {service.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenEditServiceDialog(service)}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        color={service.isActive ? 'warning' : 'success'}
                        onClick={() => handleToggleServiceActive(service.id)}
                      >
                        {service.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No services found matching your filters. Try adjusting your search criteria.
          </Typography>
        </Paper>
      )}
      
      {/* Service Form Dialog */}
      <ServiceFormDialog
        open={openServiceDialog}
        onClose={handleCloseServiceDialog}
        onSave={handleSaveService}
        service={selectedService}
        businessUnits={mockBusinessUnits}
      />
    </Box>
  );
};

export default ServiceCatalog;
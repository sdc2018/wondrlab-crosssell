import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Divider, 
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Tabs,
  Tab,
  IconButton,
  Tooltip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';

// Mock service data (in a real app, this would be fetched from an API)
const mockServices = [
  {
    id: 1,
    name: 'Digital Marketing Strategy',
    description: 'Comprehensive digital marketing strategy development',
    businessUnit: 'Digital Media',
    category: 'Strategy',
    activeClients: 5,
    potentialClients: 8
  },
  {
    id: 2,
    name: 'Content Creation',
    description: 'High-quality content creation for various platforms',
    businessUnit: 'Content',
    category: 'Creative',
    activeClients: 7,
    potentialClients: 4
  },
  {
    id: 3,
    name: 'Social Media Management',
    description: 'Full-service social media management and strategy',
    businessUnit: 'Digital Media',
    category: 'Marketing',
    activeClients: 6,
    potentialClients: 5
  },
  {
    id: 4,
    name: 'Video Production',
    description: 'Professional video production services',
    businessUnit: 'Video Production',
    category: 'Production',
    activeClients: 4,
    potentialClients: 7
  },
  {
    id: 5,
    name: 'Event Management',
    description: 'End-to-end event planning and execution',
    businessUnit: 'Experiential Marketing',
    category: 'Marketing',
    activeClients: 3,
    potentialClients: 6
  }
];

// Mock active clients for this service
const mockActiveClients = [
  { id: 1, name: 'TechCorp', industry: 'Technology', region: 'North' },
  { id: 3, name: 'FoodDelights', industry: 'Food & Beverage', region: 'Central' },
  { id: 5, name: 'HealthFirst', industry: 'Healthcare', region: 'West' },
];

// Mock potential clients for this service
const mockPotentialClients = [
  { id: 2, name: 'Fashion Forward', industry: 'Fashion', region: 'South' },
  { id: 4, name: 'FinancePlus', industry: 'Finance', region: 'East' },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`service-tabpanel-${index}`}
      aria-labelledby={`service-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (serviceId) {
      // In a real app, this would be an API call
      const foundService = mockServices.find(s => s.id === parseInt(serviceId));
      if (foundService) {
        setService(foundService);
      } else {
        // Service not found, redirect to services list
        navigate('/services');
      }
    }
  }, [serviceId, navigate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate('/services');
  };

  const handleEdit = () => {
    navigate(`/services/${serviceId}/edit`);
  };

  if (!service) {
    return (
      <Box sx={{ padding: '20px', textAlign: 'center' }}>
        <Typography>Loading service details...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '20px' }}>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            {service.name}
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit Service
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Service Details */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 3, gap: 3 }}>
          <Box sx={{ flex: '1 1 60%', minWidth: '300px' }}>
            <Typography variant="h6" gutterBottom>Description</Typography>
            <Typography variant="body1" paragraph>
              {service.description}
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 30%', minWidth: '250px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  <strong>Business Unit:</strong> {service.businessUnit}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  <strong>Category:</strong> {service.category}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="body1">
                  <strong>Active Clients:</strong> {' '}
                  <Chip 
                    label={service.activeClients} 
                    color="primary" 
                    size="small" 
                  />
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="body1">
                  <strong>Potential Clients:</strong> {' '}
                  <Chip 
                    label={service.potentialClients} 
                    color="secondary" 
                    size="small" 
                    variant="outlined"
                  />
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Tabs for Active Clients, Potential Clients, and Opportunities */}
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="service tabs">
              <Tab label="Active Clients" />
              <Tab label="Potential Clients" />
              <Tab label="Opportunities" />
            </Tabs>
          </Box>
          
          {/* Active Clients Tab */}
          <TabPanel value={tabValue} index={0}>
            <List>
              {mockActiveClients.map((client) => (
                <ListItem 
                  key={client.id}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/clients/${client.id}`)}
                  divider
                >
                  <ListItemAvatar>
                    <Avatar>
                      <BusinessIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={client.name} 
                    secondary={`${client.industry} | ${client.region}`} 
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>
          
          {/* Potential Clients Tab */}
          <TabPanel value={tabValue} index={1}>
            <List>
              {mockPotentialClients.map((client) => (
                <ListItem 
                  key={client.id}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/clients/${client.id}`)}
                  divider
                >
                  <ListItemAvatar>
                    <Avatar>
                      <BusinessIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={client.name} 
                    secondary={`${client.industry} | ${client.region}`} 
                  />
                  <Tooltip title="Create Opportunity">
                    <IconButton 
                      edge="end" 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/opportunities/new', { 
                          state: { 
                            clientId: client.id, 
                            serviceId: service.id 
                          } 
                        });
                      }}
                    >
                      <AssignmentIcon color="secondary" />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          </TabPanel>
          
          {/* Opportunities Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No opportunities found for this service.
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AssignmentIcon />}
                onClick={() => navigate('/opportunities/new', { state: { serviceId: service.id } })}
                sx={{ mt: 2 }}
              >
                Create New Opportunity
              </Button>
            </Box>
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default ServiceDetailPage;
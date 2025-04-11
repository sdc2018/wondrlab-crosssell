import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton, Paper } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Import pages
import DashboardPage from './pages/dashboard/DashboardPage';
import ClientListPage from './pages/clients/ClientListPage';
import AddClientPage from './pages/clients/AddClientPage';

// Import service pages
import ServiceListPage from './pages/services/ServiceListPage';
import AddServicePage from './pages/services/AddServicePage';
import EditServicePage from './pages/services/EditServicePage';
import ServiceDetailPage from './pages/services/ServiceDetailPage';

// Import business unit pages
import BusinessUnitListPage from './pages/business-units/BusinessUnitListPage';
import AddBusinessUnitPage from './pages/business-units/AddBusinessUnitPage';

// Import opportunity pages
import OpportunityListPage from './pages/opportunities/OpportunityListPage';
import AddOpportunityPage from './pages/opportunities/AddOpportunityPage';

// Import user management pages
import UserManagementPage from './pages/admin/UserManagementPage';
import AddUserPage from './pages/admin/AddUserPage';

// Import context providers
import { ServicesProvider } from './contexts/ServicesContext';
import { BusinessUnitsProvider } from './contexts/BusinessUnitsContext';
import { UsersProvider } from './contexts/UsersContext';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Placeholder component for pages under construction
const UnderConstructionPage = ({ pageName }: { pageName: string }) => (
  <Box sx={{ padding: '20px', textAlign: 'center' }}>
    <Typography variant="h4" gutterBottom>
      {pageName} Page
    </Typography>
    <Typography variant="body1">
      This page is currently under construction. Please check back later.
    </Typography>
  </Box>
);

// Placeholder for Client Detail Page
const ClientDetailPage = () => {
  return (
    <Box sx={{ padding: '20px' }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            component={Link} 
            to="/clients"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            Client Details
          </Typography>
        </Box>
        <Typography variant="body1">
          This page displays detailed information about a client, including contacts, engagements, and opportunities.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          The Client Details page is currently under development. Check back soon for complete client information.
        </Typography>
      </Paper>
    </Box>
  );
};

// Placeholder for Edit Client Page
const EditClientPage = () => {
  return (
    <Box sx={{ padding: '20px' }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            component={Link} 
            to="/clients"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            Edit Client
          </Typography>
        </Box>
        <Typography variant="body1">
          This page allows you to edit client information.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          The Edit Client page is currently under development. Check back soon for the ability to edit client information.
        </Typography>
      </Paper>
    </Box>
  );
};
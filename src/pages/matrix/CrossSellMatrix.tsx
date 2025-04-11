import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Tooltip,
  IconButton,
  Grid,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { CSVLink } from 'react-csv';

// Mock data for clients
const mockClients = [
  {
    id: 1,
    name: 'TechCorp',
    industry: 'Technology',
    region: 'North',
    primaryAccountManager: 'John Smith',
    primaryBU: 'Content'
  },
  {
    id: 2,
    name: 'Fashion Forward',
    industry: 'Fashion',
    region: 'West',
    primaryAccountManager: 'Sarah Johnson',
    primaryBU: 'Experiential Marketing'
  },
  {
    id: 3,
    name: 'Food Delights',
    industry: 'Food & Beverage',
    region: 'South',
    primaryAccountManager: 'John Smith',
    primaryBU: 'Content'
  }
];

// Mock data for services
const mockServices = [
  { id: 1, name: 'Content Strategy', bu: 'Content' },
  { id: 2, name: 'Video Production', bu: 'Content' },
  { id: 3, name: 'Digital Marketing', bu: 'Digital Media' },
  { id: 4, name: 'Event Management', bu: 'Experiential Marketing' },
  { id: 5, name: 'Performance Marketing', bu: 'Performance Marketing' }
];

// Mock data for engagements (active services)
const mockEngagements = [
  { clientId: 1, serviceId: 1, startDate: '2022-05-15', endDate: null, status: 'Active' },
  { clientId: 1, serviceId: 2, startDate: '2022-08-01', endDate: null, status: 'Active' },
  { clientId: 2, serviceId: 4, startDate: '2022-03-10', endDate: null, status: 'Active' },
  { clientId: 3, serviceId: 1, startDate: '2022-01-15', endDate: null, status: 'Active' }
];

// Mock data for opportunities
const mockOpportunities = [
  { 
    id: 1, 
    clientId: 1, 
    serviceId: 3, 
    status: 'In Discussion', 
    assignedTo: 'Sarah Johnson',
    createdDate: '2023-06-01',
    expectedCloseDate: '2023-07-30',
    estimatedValue: '$25,000',
    priority: 'High'
  },
  { 
    id: 2, 
    clientId: 2, 
    serviceId: 2, 
    status: 'Proposal Sent', 
    assignedTo: 'Mike Wilson',
    createdDate: '2023-05-15',
    expectedCloseDate: '2023-08-15',
    estimatedValue: '$35,000',
    priority: 'Medium'
  },
  { 
    id: 3, 
    clientId: 3, 
    serviceId: 3, 
    status: 'Won', 
    assignedTo: 'Sarah Johnson',
    createdDate: '2023-03-10',
    expectedCloseDate: '2023-04-30',
    estimatedValue: '$50,000',
    priority: 'High',
    closedDate: '2023-04-25'
  }
];

// Cell status types
type CellStatus = 'active' | 'opportunity' | 'closed' | 'potential' | 'empty';

const CrossSellMatrix: React.FC = () => {
  // State for filtered data
  const [filteredClients, setFilteredClients] = useState(mockClients);
  const [filteredServices, setFilteredServices] = useState(mockServices);
  
  // Handle cell click
  const handleCellClick = (clientId: number, serviceId: number, status: CellStatus) => {
    if (status === 'empty' || status === 'potential') {
      // In a real app, we would open a dialog to create a new opportunity
      alert(`Create new opportunity for client ${clientId} and service ${serviceId}`);
    } else if (status === 'opportunity' || status === 'active' || status === 'closed') {
      // In a real app, we would open a dialog to view/edit the opportunity
      alert(`View details for client ${clientId} and service ${serviceId}`);
    }
  };
  
  // Handle file import
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real application, we would process the file here
      alert(`File "${file.name}" selected for import. This would be processed in a real application.`);
    }
  };
  
  // Prepare data for export
  const prepareExportData = () => {
    const data: any[] = [];
    
    filteredClients.forEach(client => {
      const row: any = {
        ClientName: client.name,
        Industry: client.industry,
        Region: client.region,
        PrimaryAccountManager: client.primaryAccountManager,
        PrimaryBU: client.primaryBU
      };
      
      filteredServices.forEach(service => {
        const engagement = mockEngagements.find(
          e => e.clientId === client.id && e.serviceId === service.id
        );
        
        const opportunity = mockOpportunities.find(
          o => o.clientId === client.id && o.serviceId === service.id
        );
        
        let status = 'None';
        if (engagement) {
          status = 'Active';
        } else if (opportunity) {
          status = opportunity.status;
        }
        
        row[`${service.name} (${service.bu})`] = status;
      });
      
      data.push(row);
    });
    
    return data;
  };
  
  // Prepare export headers
  const exportHeaders = [
    { label: 'Client Name', key: 'ClientName' },
    { label: 'Industry', key: 'Industry' },
    { label: 'Region', key: 'Region' },
    { label: 'Primary Account Manager', key: 'PrimaryAccountManager' },
    { label: 'Primary Business Unit', key: 'PrimaryBU' },
    ...filteredServices.map(service => ({
      label: `${service.name} (${service.bu})`,
      key: `${service.name} (${service.bu})`
    }))
  ];
  
  // Get cell status
  const getCellStatus = (clientId: number, serviceId: number): CellStatus => {
    // Check if there's an active engagement
    const engagement = mockEngagements.find(
      e => e.clientId === clientId && e.serviceId === serviceId
    );
    
    if (engagement) {
      return 'active';
    }
    
    // Check if there's an opportunity
    const opportunity = mockOpportunities.find(
      o => o.clientId === clientId && o.serviceId === serviceId
    );
    
    if (opportunity) {
      if (opportunity.status === 'Won' || opportunity.status === 'Lost' || opportunity.status === 'Cancelled') {
        return 'closed';
      }
      return 'opportunity';
    }
    
    // If client's primary BU matches service's BU, mark as potential
    const client = mockClients.find(c => c.id === clientId);
    const service = mockServices.find(s => s.id === serviceId);
    
    if (client && service && client.primaryBU !== service.bu) {
      return 'potential';
    }
    
    return 'empty';
  };
  
  // Get cell color based on status
  const getCellColor = (status: CellStatus) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'opportunity':
        return 'primary';
      case 'closed':
        return 'error';
      case 'potential':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  return (
    <Box>
      {/* Header with title and actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Cross-Sell Opportunity Matrix</Typography>
        <Box>
          {/* Import Button with hidden file input */}
          <input
            accept=".csv,.xlsx"
            id="import-matrix"
            type="file"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
          <label htmlFor="import-matrix">
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
            data={prepareExportData()} 
            headers={exportHeaders}
            filename={"wondrlab-crosssell-matrix.csv"}
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
      
      {/* Matrix Legend */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Legend</Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Chip color="success" label="Active Engagement" />
          </Grid>
          <Grid item>
            <Chip color="primary" label="Open Opportunity" />
          </Grid>
          <Grid item>
            <Chip color="error" label="Closed/Lost Opportunity" />
          </Grid>
          <Grid item>
            <Chip color="warning" label="Potential Opportunity" />
          </Grid>
          <Grid item>
            <Chip label="No Relationship" />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Matrix Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="cross-sell matrix">
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 200 }}>Client / Service</TableCell>
                {filteredServices.map((service) => (
                  <TableCell 
                    key={service.id} 
                    align="center"
                    sx={{ minWidth: 150 }}
                  >
                    <Tooltip title={`Business Unit: ${service.bu}`}>
                      <Typography variant="subtitle2">
                        {service.name}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    {client.name}
                  </TableCell>
                  {filteredServices.map((service) => {
                    const status = getCellStatus(client.id, service.id);
                    return (
                      <TableCell 
                        key={`${client.id}-${service.id}`} 
                        align="center"
                        onClick={() => handleCellClick(client.id, service.id, status)}
                        sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                      >
                        {status === 'empty' ? (
                          <IconButton size="small">
                            <AddIcon fontSize="small" />
                          </IconButton>
                        ) : (
                          <Chip 
                            color={getCellColor(status)}
                            label={status.charAt(0).toUpperCase() + status.slice(1)}
                            size="small"
                          />
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CrossSellMatrix;

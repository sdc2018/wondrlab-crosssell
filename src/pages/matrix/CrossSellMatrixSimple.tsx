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
  Download as DownloadIcon,
  Upload as UploadIcon
} from '@mui/icons-material';

// Mock data for clients
const mockClients = [
  {
    id: 1,
    name: 'TechCorp',
    industry: 'Technology'
  },
  {
    id: 2,
    name: 'Fashion Forward',
    industry: 'Fashion'
  },
  {
    id: 3,
    name: 'Food Delights',
    industry: 'Food & Beverage'
  }
];

// Mock data for services
const mockServices = [
  { id: 1, name: 'Content Strategy', bu: 'Content' },
  { id: 2, name: 'Video Production', bu: 'Content' },
  { id: 3, name: 'Digital Marketing', bu: 'Digital Media' }
];

// Mock data for cell statuses
const mockCellStatuses = [
  { clientId: 1, serviceId: 1, status: 'active' },
  { clientId: 1, serviceId: 3, status: 'opportunity' },
  { clientId: 2, serviceId: 2, status: 'opportunity' },
  { clientId: 2, serviceId: 3, status: 'potential' },
  { clientId: 3, serviceId: 1, status: 'active' },
  { clientId: 3, serviceId: 2, status: 'closed' }
];

// Cell status types
type CellStatus = 'active' | 'opportunity' | 'closed' | 'potential' | 'empty';

const CrossSellMatrixSimple: React.FC = () => {
  const [clients] = useState(mockClients);
  const [services] = useState(mockServices);
  
  // Get cell status
  const getCellStatus = (clientId: number, serviceId: number): CellStatus => {
    const cellData = mockCellStatuses.find(
      cell => cell.clientId === clientId && cell.serviceId === serviceId
    );
    
    return cellData ? cellData.status as CellStatus : 'empty';
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
  
  // Handle cell click
  const handleCellClick = (clientId: number, serviceId: number, status: CellStatus) => {
    alert(`Clicked cell for client ${clientId} and service ${serviceId} with status ${status}`);
  };
  
  return (
    <Box>
      {/* Header with title and actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Cross-Sell Opportunity Matrix</Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<UploadIcon />}
            sx={{ mr: 1 }}
          >
            Import
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
          >
            Export
          </Button>
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
                {services.map((service) => (
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
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    {client.name}
                  </TableCell>
                  {services.map((service) => {
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

export default CrossSellMatrixSimple;

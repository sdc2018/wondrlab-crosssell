import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Chip,
  Tooltip
} from '@mui/material';
import { getClients, getServices, getOpportunities } from '../../services/api';
import { OpportunityStatus } from '../../types';

// Define types for the component props
interface CrossSellMatrixProps {
  title?: string;
}

// Define types for the data
interface Client {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
}

interface Opportunity {
  id: string;
  clientId: string;
  serviceId: string;
  status: string;
}

// Helper function to get cell color based on opportunity status
const getCellColor = (status: string | undefined) => {
  if (!status) return 'transparent';
  
  switch (status) {
    case OpportunityStatus.WON:
      return '#4caf50'; // Green
    case OpportunityStatus.IN_PROGRESS:
      return '#2196f3'; // Blue
    case OpportunityStatus.OPEN:
      return '#ff9800'; // Orange
    case OpportunityStatus.LOST:
      return '#f44336'; // Red
    case OpportunityStatus.ON_HOLD:
      return '#9e9e9e'; // Gray
    default:
      return 'transparent';
  }
};

export const CrossSellMatrix: React.FC<CrossSellMatrixProps> = ({ title = 'Cross-Sell Matrix' }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch clients, services, and opportunities in parallel
        const [clientsData, servicesData, opportunitiesData] = await Promise.all([
          getClients(),
          getServices(),
          getOpportunities()
        ]);
        
        setClients(clientsData);
        setServices(servicesData);
        setOpportunities(opportunitiesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data for cross-sell matrix:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Find opportunity for a specific client and service
  const findOpportunity = (clientId: string, serviceId: string) => {
    return opportunities.find(
      opp => opp.clientId === clientId && opp.serviceId === serviceId
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>{title}</Typography>
      
      <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 600 }}>
        <Table stickyHeader aria-label="cross-sell matrix">
          <TableHead>
            <TableRow>
              <TableCell>Clients / Services</TableCell>
              {services.map(service => (
                <TableCell key={service.id} align="center">
                  <Tooltip title={service.name}>
                    <Typography noWrap sx={{ maxWidth: 120 }}>
                      {service.name}
                    </Typography>
                  </Tooltip>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map(client => (
              <TableRow key={client.id}>
                <TableCell component="th" scope="row">
                  <Tooltip title={client.name}>
                    <Typography noWrap sx={{ maxWidth: 150 }}>
                      {client.name}
                    </Typography>
                  </Tooltip>
                </TableCell>
                {services.map(service => {
                  const opportunity = findOpportunity(client.id, service.id);
                  return (
                    <TableCell 
                      key={`${client.id}-${service.id}`} 
                      align="center"
                      sx={{
                        backgroundColor: getCellColor(opportunity?.status),
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.8
                        }
                      }}
                    >
                      {opportunity && (
                        <Chip 
                          label={opportunity.status} 
                          size="small"
                          sx={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            color: 'rgba(0, 0, 0, 0.8)'
                          }}
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
  );
};

export default CrossSellMatrix;

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
  TablePagination,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from '@mui/icons-material';

// Interface for client
interface Client {
  id: number;
  name: string;
  industry: string;
  region: string;
  primaryAccountManager: string;
  primaryBU: string;
  activeServices: number;
  potentialServices: number;
}

// Mock data for clients
const mockClients: Client[] = [
  {
    id: 1,
    name: 'TechCorp',
    industry: 'Technology',
    region: 'North',
    primaryAccountManager: 'John Smith',
    primaryBU: 'Content',
    activeServices: 2,
    potentialServices: 3
  },
  {
    id: 2,
    name: 'Fashion Forward',
    industry: 'Fashion',
    region: 'West',
    primaryAccountManager: 'Sarah Johnson',
    primaryBU: 'Experiential Marketing',
    activeServices: 1,
    potentialServices: 4
  },
  {
    id: 3,
    name: 'Food Delights',
    industry: 'Food & Beverage',
    region: 'South',
    primaryAccountManager: 'John Smith',
    primaryBU: 'Content',
    activeServices: 1,
    potentialServices: 2
  }
];

const ClientListSimple: React.FC = () => {
  // State for clients
  const [clients] = useState<Client[]>(mockClients);
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  
  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.primaryAccountManager.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.primaryBU.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Box>
      {/* Header with title and actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Client Management</Typography>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            sx={{ mr: 1 }}
          >
            Add Client
          </Button>
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
      
      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
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
        />
      </Paper>
      
      {/* Clients Table */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table aria-label="clients table">
            <TableHead>
              <TableRow>
                <TableCell>Client Name</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell>Region</TableCell>
                <TableCell>Primary Account Manager</TableCell>
                <TableCell>Primary Business Unit</TableCell>
                <TableCell align="center">Active Services</TableCell>
                <TableCell align="center">Potential Services</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((client) => (
                  <TableRow key={client.id}>
                    <TableCell component="th" scope="row">
                      {client.name}
                    </TableCell>
                    <TableCell>{client.industry}</TableCell>
                    <TableCell>{client.region}</TableCell>
                    <TableCell>{client.primaryAccountManager}</TableCell>
                    <TableCell>{client.primaryBU}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={client.activeServices} 
                        color="primary" 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={client.potentialServices} 
                        color="secondary" 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Client">
                        <IconButton size="small">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Client">
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredClients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default ClientListSimple;

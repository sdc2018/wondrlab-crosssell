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

// Interface for opportunity
interface Opportunity {
  id: number;
  clientName: string;
  serviceName: string;
  status: string;
  priority: string;
  assignedTo: string;
  createdDate: string;
  expectedCloseDate: string;
  estimatedValue: string;
}

// Mock data for opportunities
const mockOpportunities: Opportunity[] = [
  {
    id: 1,
    clientName: 'TechCorp',
    serviceName: 'Digital Marketing',
    status: 'In Discussion',
    priority: 'High',
    assignedTo: 'Sarah Johnson',
    createdDate: '2023-06-01',
    expectedCloseDate: '2023-07-30',
    estimatedValue: '$25,000'
  },
  {
    id: 2,
    clientName: 'Fashion Forward',
    serviceName: 'Video Production',
    status: 'Proposal Sent',
    priority: 'Medium',
    assignedTo: 'Mike Wilson',
    createdDate: '2023-05-15',
    expectedCloseDate: '2023-08-15',
    estimatedValue: '$35,000'
  },
  {
    id: 3,
    clientName: 'Food Delights',
    serviceName: 'Content Strategy',
    status: 'Won',
    priority: 'High',
    assignedTo: 'Sarah Johnson',
    createdDate: '2023-03-10',
    expectedCloseDate: '2023-04-30',
    estimatedValue: '$50,000'
  },
  {
    id: 4,
    clientName: 'Finance Plus',
    serviceName: 'Performance Marketing',
    status: 'Lost',
    priority: 'Medium',
    assignedTo: 'John Smith',
    createdDate: '2023-02-15',
    expectedCloseDate: '2023-04-15',
    estimatedValue: '$40,000'
  },
  {
    id: 5,
    clientName: 'Healthcare Solutions',
    serviceName: 'Content Strategy',
    status: 'Identified',
    priority: 'Low',
    assignedTo: 'Mike Wilson',
    createdDate: '2023-06-10',
    expectedCloseDate: '2023-08-30',
    estimatedValue: '$30,000'
  }
];

const OpportunityList: React.FC = () => {
  // State for opportunities
  const [opportunities] = useState<Opportunity[]>(mockOpportunities);
  
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
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Identified':
        return 'default';
      case 'In Discussion':
        return 'primary';
      case 'Proposal Sent':
        return 'secondary';
      case 'On Hold':
        return 'warning';
      case 'Won':
        return 'success';
      case 'Lost':
        return 'error';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };
  
  // Filter opportunities based on search term
  const filteredOpportunities = opportunities.filter(opportunity => 
    opportunity.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <Box>
      {/* Header with title and actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Opportunity Management</Typography>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            sx={{ mr: 1 }}
          >
            Add Opportunity
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
        />
      </Paper>
      
      {/* Opportunities Table */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table aria-label="opportunities table">
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Expected Close</TableCell>
                <TableCell>Value</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOpportunities
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((opportunity) => (
                  <TableRow key={opportunity.id}>
                    <TableCell>{opportunity.clientName}</TableCell>
                    <TableCell>{opportunity.serviceName}</TableCell>
                    <TableCell>
                      <Chip 
                        label={opportunity.status} 
                        color={getStatusColor(opportunity.status) as any} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={opportunity.priority} 
                        color={getPriorityColor(opportunity.priority) as any} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{opportunity.assignedTo}</TableCell>
                    <TableCell>{formatDate(opportunity.createdDate)}</TableCell>
                    <TableCell>{formatDate(opportunity.expectedCloseDate)}</TableCell>
                    <TableCell>{opportunity.estimatedValue}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Opportunity">
                        <IconButton size="small">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Opportunity">
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
          count={filteredOpportunities.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default OpportunityList;

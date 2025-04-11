import React, { useState } from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  TableSortLabel,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

// Opportunity interface
export interface Opportunity {
  id: number;
  clientId: number;
  clientName: string;
  serviceId: number;
  serviceName: string;
  status: 'Identified' | 'In Discussion' | 'Proposal Sent' | 'On Hold' | 'Won' | 'Lost' | 'Cancelled';
  priority: 'High' | 'Medium' | 'Low';
  assignedToUserId: number;
  assignedToUserName: string;
  createdDate: string;
  expectedCloseDate: string | null;
  estimatedValue: number | null;
  businessUnitId: number;
  businessUnitName: string;
}

interface OpportunityListProps {
  opportunities: Opportunity[];
}

type Order = 'asc' | 'desc';

interface HeadCell {
  id: keyof Opportunity;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: 'clientName', label: 'Client', numeric: false, sortable: true },
  { id: 'serviceName', label: 'Service', numeric: false, sortable: true },
  { id: 'businessUnitName', label: 'Business Unit', numeric: false, sortable: true },
  { id: 'status', label: 'Status', numeric: false, sortable: true },
  { id: 'priority', label: 'Priority', numeric: false, sortable: true },
  { id: 'assignedToUserName', label: 'Assigned To', numeric: false, sortable: true },
  { id: 'estimatedValue', label: 'Value', numeric: true, sortable: true },
  { id: 'expectedCloseDate', label: 'Expected Close', numeric: false, sortable: true },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string | null }, b: { [key in Key]: number | string | null }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Function to get status chip color
const getStatusColor = (status: Opportunity['status']) => {
  switch (status) {
    case 'Identified':
      return 'info';
    case 'In Discussion':
      return 'secondary';
    case 'Proposal Sent':
      return 'warning';
    case 'On Hold':
      return 'default';
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

// Function to get priority chip color
const getPriorityColor = (priority: Opportunity['priority']) => {
  switch (priority) {
    case 'High':
      return 'error';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'info';
    default:
      return 'default';
  }
};

const OpportunityList: React.FC<OpportunityListProps> = ({ opportunities }) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Opportunity>('clientName');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (property: keyof Opportunity) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewOpportunity = (id: number) => {
    navigate(`/opportunities/${id}`);
  };

  const handleEditOpportunity = (id: number) => {
    navigate(`/opportunities/${id}/edit`);
  };

  // Format currency
  const formatCurrency = (value: number | null) => {
    if (value === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Calculate empty rows to maintain consistent page height
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - opportunities.length) : 0;

  // Apply sorting and pagination
  const visibleRows = React.useMemo(
    () =>
      [...opportunities]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [opportunities, order, orderBy, page, rowsPerPage],
  );

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="opportunitiesTable"
          size="medium"
        >
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  {headCell.sortable ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : (
                    headCell.label
                  )}
                </TableCell>
              ))}
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((opportunity) => (
              <TableRow
                hover
                key={opportunity.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {opportunity.clientName}
                </TableCell>
                <TableCell>{opportunity.serviceName}</TableCell>
                <TableCell>{opportunity.businessUnitName}</TableCell>
                <TableCell>
                  <Chip 
                    label={opportunity.status} 
                    color={getStatusColor(opportunity.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={opportunity.priority} 
                    color={getPriorityColor(opportunity.priority)} 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{opportunity.assignedToUserName}</TableCell>
                <TableCell align="right">{formatCurrency(opportunity.estimatedValue)}</TableCell>
                <TableCell>{formatDate(opportunity.expectedCloseDate)}</TableCell>
                <TableCell align="center">
                  <Tooltip title="View Opportunity">
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewOpportunity(opportunity.id)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Opportunity">
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditOpportunity(opportunity.id)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={9} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={opportunities.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default OpportunityList;
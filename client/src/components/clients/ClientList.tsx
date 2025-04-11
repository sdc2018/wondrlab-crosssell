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

// Client interface
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

interface ClientListProps {
  clients: Client[];
}

type Order = 'asc' | 'desc';

interface HeadCell {
  id: keyof Client;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: 'name', label: 'Client Name', numeric: false, sortable: true },
  { id: 'industry', label: 'Industry', numeric: false, sortable: true },
  { id: 'region', label: 'Region', numeric: false, sortable: true },
  { id: 'primaryAccountManager', label: 'Account Manager', numeric: false, sortable: true },
  { id: 'primaryBU', label: 'Primary BU', numeric: false, sortable: true },
  { id: 'activeServices', label: 'Active Services', numeric: true, sortable: true },
  { id: 'potentialServices', label: 'Potential Services', numeric: true, sortable: true },
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
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const ClientList: React.FC<ClientListProps> = ({ clients }) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Client>('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (property: keyof Client) => {
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

  const handleViewClient = (id: number) => {
    navigate(`/clients/${id}`);
  };

  const handleEditClient = (id: number) => {
    navigate(`/clients/${id}/edit`);
  };

  // Calculate empty rows to maintain consistent page height
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - clients.length) : 0;

  // Apply sorting and pagination
  const visibleRows = React.useMemo(
    () =>
      [...clients]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [clients, order, orderBy, page, rowsPerPage],
  );

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="clientsTable"
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
            {visibleRows.map((client) => (
              <TableRow
                hover
                key={client.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {client.name}
                </TableCell>
                <TableCell>{client.industry}</TableCell>
                <TableCell>{client.region}</TableCell>
                <TableCell>{client.primaryAccountManager}</TableCell>
                <TableCell>{client.primaryBU}</TableCell>
                <TableCell align="right">
                  <Chip 
                    label={client.activeServices} 
                    color="primary" 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="right">
                  <Chip 
                    label={client.potentialServices} 
                    color="secondary" 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Client">
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewClient(client.id)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Client">
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditClient(client.id)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={8} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={clients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ClientList;

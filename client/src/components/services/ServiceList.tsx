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

// Service interface
export interface Service {
  id: number;
  name: string;
  description: string;
  businessUnit: string;
  category: string;
  activeClients: number;
  potentialClients: number;
}

interface ServiceListProps {
  services: Service[];
}

type Order = 'asc' | 'desc';

interface HeadCell {
  id: keyof Service;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: 'name', label: 'Service Name', numeric: false, sortable: true },
  { id: 'description', label: 'Description', numeric: false, sortable: false },
  { id: 'businessUnit', label: 'Business Unit', numeric: false, sortable: true },
  { id: 'category', label: 'Category', numeric: false, sortable: true },
  { id: 'activeClients', label: 'Active Clients', numeric: true, sortable: true },
  { id: 'potentialClients', label: 'Potential Clients', numeric: true, sortable: true },
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

const ServiceList: React.FC<ServiceListProps> = ({ services }) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Service>('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (property: keyof Service) => {
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

  const handleViewService = (id: number) => {
    navigate(`/services/${id}`);
  };

  const handleEditService = (id: number) => {
    navigate(`/services/${id}/edit`);
  };

  // Calculate empty rows to maintain consistent page height
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - services.length) : 0;

  // Apply sorting and pagination
  const visibleRows = React.useMemo(
    () =>
      [...services]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [services, order, orderBy, page, rowsPerPage],
  );

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="servicesTable"
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
            {visibleRows.map((service) => (
              <TableRow
                hover
                key={service.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {service.name}
                </TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>{service.businessUnit}</TableCell>
                <TableCell>{service.category}</TableCell>
                <TableCell align="right">
                  <Chip 
                    label={service.activeClients} 
                    color="primary" 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="right">
                  <Chip 
                    label={service.potentialClients} 
                    color="secondary" 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Service">
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewService(service.id)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Service">
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditService(service.id)}
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
        count={services.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ServiceList;

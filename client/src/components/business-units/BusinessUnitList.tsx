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

// Business Unit interface
export interface BusinessUnit {
  id: number;
  name: string;
  description: string;
  headName: string;
  headEmail: string;
  services: number;
  activeClients: number;
}

interface BusinessUnitListProps {
  businessUnits: BusinessUnit[];
}

type Order = 'asc' | 'desc';

interface HeadCell {
  id: keyof BusinessUnit;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: 'name', label: 'Business Unit Name', numeric: false, sortable: true },
  { id: 'description', label: 'Description', numeric: false, sortable: false },
  { id: 'headName', label: 'Head', numeric: false, sortable: true },
  { id: 'services', label: 'Services', numeric: true, sortable: true },
  { id: 'activeClients', label: 'Active Clients', numeric: true, sortable: true },
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

const BusinessUnitList: React.FC<BusinessUnitListProps> = ({ businessUnits }) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof BusinessUnit>('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (property: keyof BusinessUnit) => {
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

  const handleViewBusinessUnit = (id: number) => {
    navigate(`/business-units/${id}`);
  };

  const handleEditBusinessUnit = (id: number) => {
    navigate(`/business-units/${id}/edit`);
  };

  // Calculate empty rows to maintain consistent page height
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - businessUnits.length) : 0;

  // Apply sorting and pagination
  const visibleRows = React.useMemo(
    () =>
      [...businessUnits]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [businessUnits, order, orderBy, page, rowsPerPage],
  );

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="businessUnitsTable"
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
            {visibleRows.map((businessUnit) => (
              <TableRow
                hover
                key={businessUnit.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {businessUnit.name}
                </TableCell>
                <TableCell>{businessUnit.description}</TableCell>
                <TableCell>{businessUnit.headName}</TableCell>
                <TableCell align="right">{businessUnit.services}</TableCell>
                <TableCell align="right">{businessUnit.activeClients}</TableCell>
                <TableCell align="center">
                  <Tooltip title="View Business Unit">
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewBusinessUnit(businessUnit.id)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Business Unit">
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditBusinessUnit(businessUnit.id)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={businessUnits.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default BusinessUnitList;

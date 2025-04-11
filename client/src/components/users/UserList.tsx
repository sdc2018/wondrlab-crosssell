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
  Chip,
  Switch,
  FormControlLabel
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { User, UserRole, useUsers } from '../../contexts/UsersContext';

interface UserListProps {
  users: User[];
  onToggleStatus?: (id: number) => void;
  onDelete?: (id: number) => void;
}

type Order = 'asc' | 'desc';

interface HeadCell {
  id: keyof User;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: 'name', label: 'Name', numeric: false, sortable: true },
  { id: 'email', label: 'Email', numeric: false, sortable: true },
  { id: 'role', label: 'Role', numeric: false, sortable: true },
  { id: 'associatedBU', label: 'Business Unit', numeric: false, sortable: true },
  { id: 'isActive', label: 'Status', numeric: false, sortable: true },
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
): (a: { [key in Key]: number | string | boolean | null }, b: { [key in Key]: number | string | boolean | null }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Function to get role chip color
const getRoleColor = (role: UserRole) => {
  switch (role) {
    case 'Admin':
      return 'error';
    case 'BUManager':
      return 'primary';
    case 'SalesExec':
      return 'success';
    case 'Executive':
      return 'warning';
    default:
      return 'default';
  }
};

const UserList: React.FC<UserListProps> = ({ users, onToggleStatus, onDelete }) => {
  const navigate = useNavigate();
  const { toggleUserStatus, deleteUser } = useUsers();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof User>('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (property: keyof User) => {
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

  const handleViewUser = (id: number) => {
    navigate(`/admin/users/${id}`);
  };

  const handleEditUser = (id: number) => {
    navigate(`/admin/users/${id}/edit`);
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      if (onDelete) {
        onDelete(id);
      } else {
        deleteUser(id);
      }
    }
  };

  const handleToggleStatus = (id: number) => {
    if (onToggleStatus) {
      onToggleStatus(id);
    } else {
      toggleUserStatus(id);
    }
  };

  // Calculate empty rows to maintain consistent page height
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  // Apply sorting and pagination
  const visibleRows = React.useMemo(
    () =>
      [...users]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [users, order, orderBy, page, rowsPerPage],
  );

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="usersTable"
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
            {visibleRows.map((user) => (
              <TableRow
                hover
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    color={getRoleColor(user.role)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{user.associatedBU || 'N/A'}</TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user.isActive}
                        onChange={() => handleToggleStatus(user.id)}
                        color="primary"
                      />
                    }
                    label={user.isActive ? 'Active' : 'Inactive'}
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View User">
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewUser(user.id)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit User">
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditUser(user.id)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete User">
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteUser(user.id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
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
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default UserList;

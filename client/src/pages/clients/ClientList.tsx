import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ClientForm from './ClientForm';
import clientService, { Client } from '../../services/api/clientService';

const ClientList: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await clientService.getAll();
      setClients(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to load clients. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleView = (client: Client) => {
    navigate(`/clients/${client.ClientID}`);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setOpenForm(true);
  };

  const handleDelete = async (client: Client) => {
    if (window.confirm(`Are you sure you want to delete ${client.Name}?`)) {
      try {
        await clientService.delete(client.ClientID);
        setSnackbar({
          open: true,
          message: 'Client deleted successfully',
          severity: 'success',
        });
        fetchClients();
      } catch (err) {
        console.error('Error deleting client:', err);
        setSnackbar({
          open: true,
          message: 'Failed to delete client',
          severity: 'error',
        });
      }
    }
  };

  const handleFormSubmit = async (formData: any) => {
    setSubmitting(true);
    try {
      if (editingClient) {
        await clientService.update(editingClient.ClientID, formData);
        setSnackbar({
          open: true,
          message: 'Client updated successfully',
          severity: 'success',
        });
      } else {
        await clientService.create(formData);
        setSnackbar({
          open: true,
          message: 'Client created successfully',
          severity: 'success',
        });
      }
      setOpenForm(false);
      setEditingClient(null);
      fetchClients();
    } catch (err) {
      console.error('Error saving client:', err);
      setSnackbar({
        open: true,
        message: 'Failed to save client',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingClient(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { id: 'Name', label: 'Name', minWidth: 170 },
    { id: 'Industry', label: 'Industry', minWidth: 130 },
    { id: 'Region', label: 'Region', minWidth: 130 },
    {
      id: 'PrimaryAccountManager',
      label: 'Account Manager',
      minWidth: 170,
      format: (value: any) => value?.Name || '—',
    },
    {
      id: 'PrimaryBusinessUnit',
      label: 'Business Unit',
      minWidth: 170,
      format: (value: any) => value?.Name || '—',
    },
    {
      id: 'IsActive',
      label: 'Status',
      minWidth: 100,
      format: (value: boolean) => (value ? 'Active' : 'Inactive'),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Clients
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingClient(null);
            setOpenForm(true);
          }}
        >
          Add Client
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable
          columns={columns}
          data={clients}
          title="Client List"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <FormDialog
        open={openForm}
        onClose={handleCloseForm}
        title={editingClient ? 'Edit Client' : 'Add Client'}
        onSubmit={handleFormSubmit}
        isSubmitting={submitting}
        submitLabel={editingClient ? 'Update' : 'Create'}
      >
        <ClientForm client={editingClient} onSubmit={handleFormSubmit} />
      </FormDialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientList;

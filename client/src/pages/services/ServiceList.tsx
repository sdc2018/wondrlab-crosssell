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
import serviceService, { Service } from '../../services/api/serviceService';
import businessUnitService, { BusinessUnit } from '../../services/api/businessUnitService';

// ServiceForm will be created next
const ServiceForm = ({ service, onSubmit }: { service?: Service | null; onSubmit: (formData: any) => void }) => (
  <div>Service Form Placeholder</div>
);

const ServiceList: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await serviceService.getAll();
      setServices(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessUnits = async () => {
    try {
      const data = await businessUnitService.getAll();
      setBusinessUnits(data);
    } catch (err) {
      console.error('Error fetching business units:', err);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchBusinessUnits();
  }, []);

  const handleView = (service: Service) => {
    navigate(`/services/${service.ServiceID}`);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setOpenForm(true);
  };

  const handleDelete = async (service: Service) => {
    if (window.confirm(`Are you sure you want to delete ${service.Name}?`)) {
      try {
        await serviceService.delete(service.ServiceID);
        setSnackbar({
          open: true,
          message: 'Service deleted successfully',
          severity: 'success',
        });
        fetchServices();
      } catch (err) {
        console.error('Error deleting service:', err);
        setSnackbar({
          open: true,
          message: 'Failed to delete service',
          severity: 'error',
        });
      }
    }
  };

  const handleFormSubmit = async (formData: any) => {
    setSubmitting(true);
    try {
      if (editingService) {
        await serviceService.update(editingService.ServiceID, formData);
        setSnackbar({
          open: true,
          message: 'Service updated successfully',
          severity: 'success',
        });
      } else {
        await serviceService.create(formData);
        setSnackbar({
          open: true,
          message: 'Service created successfully',
          severity: 'success',
        });
      }
      setOpenForm(false);
      setEditingService(null);
      fetchServices();
    } catch (err) {
      console.error('Error saving service:', err);
      setSnackbar({
        open: true,
        message: 'Failed to save service',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingService(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { id: 'Name', label: 'Name', minWidth: 170 },
    { id: 'Description', label: 'Description', minWidth: 200 },
    {
      id: 'BusinessUnit',
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

  // Map business unit data to services
  const servicesWithBU = services.map(service => {
    const businessUnit = businessUnits.find(bu => bu.BU_ID === service.AssociatedBU_ID);
    return {
      ...service,
      BusinessUnit: businessUnit,
    };
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Services
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingService(null);
            setOpenForm(true);
          }}
        >
          Add Service
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
          data={servicesWithBU}
          title="Service List"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <FormDialog
        open={openForm}
        onClose={handleCloseForm}
        title={editingService ? 'Edit Service' : 'Add Service'}
        onSubmit={handleFormSubmit}
        isSubmitting={submitting}
        submitLabel={editingService ? 'Update' : 'Create'}
      >
        <ServiceForm service={editingService} onSubmit={handleFormSubmit} />
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

export default ServiceList;

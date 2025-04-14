import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DetailView from '../../components/common/DetailView';
import FormDialog from '../../components/common/FormDialog';
import DataTable from '../../components/common/DataTable';
import ServiceForm from './ServiceForm';
import serviceService, { Service } from '../../services/api/serviceService';
import businessUnitService, { BusinessUnit } from '../../services/api/businessUnitService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`service-tabpanel-${index}`}
      aria-labelledby={`service-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [businessUnit, setBusinessUnit] = useState<BusinessUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [clients, setClients] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchService = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await serviceService.getById(id);
      setService(data);
      
      // Fetch the business unit
      if (data.AssociatedBU_ID) {
        const buData = await businessUnitService.getById(data.AssociatedBU_ID);
        setBusinessUnit(buData);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching service:', err);
      setError('Failed to load service details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedData = async () => {
    if (!id) return;
    
    setLoadingRelated(true);
    try {
      // Fetch clients and opportunities in parallel
      const [clientsData, opportunitiesData] = await Promise.all([
        serviceService.getClients(id),
        serviceService.getOpportunities(id),
      ]);
      
      setClients(clientsData);
      setOpportunities(opportunitiesData);
    } catch (err) {
      console.error('Error fetching related data:', err);
    } finally {
      setLoadingRelated(false);
    }
  };

  useEffect(() => {
    fetchService();
    fetchRelatedData();
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setOpenForm(true);
  };

  const handleDelete = async () => {
    if (!service) return;
    
    if (window.confirm(`Are you sure you want to delete ${service.Name}?`)) {
      try {
        await serviceService.delete(service.ServiceID);
        setSnackbar({
          open: true,
          message: 'Service deleted successfully',
          severity: 'success',
        });
        // Navigate back to services list after successful deletion
        navigate('/services');
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
    if (!service) return;
    
    setSubmitting(true);
    try {
      await serviceService.update(service.ServiceID, formData);
      setSnackbar({
        open: true,
        message: 'Service updated successfully',
        severity: 'success',
      });
      setOpenForm(false);
      fetchService();
    } catch (err) {
      console.error('Error updating service:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update service',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleBack = () => {
    navigate('/services');
  };

  // Define service detail sections
  const serviceDetailSections = service
    ? [
        {
          title: 'Service Information',
          fields: [
            { label: 'Name', value: service.Name },
            { label: 'Description', value: service.Description || '—', gridSize: 12 },
            { label: 'Business Unit', value: businessUnit?.Name || '—' },
            { 
              label: 'Status', 
              value: service.IsActive ? 'Active' : 'Inactive',
            },
          ],
        },
      ]
    : [];

  // Define columns for related data tables
  const clientColumns = [
    { id: 'Name', label: 'Name', minWidth: 170 },
    { id: 'Industry', label: 'Industry', minWidth: 130 },
    { id: 'Region', label: 'Region', minWidth: 130 },
    {
      id: 'PrimaryAccountManager',
      label: 'Account Manager',
      minWidth: 170,
      format: (value: any) => value?.Name || '—',
    },
  ];

  const opportunityColumns = [
    { id: 'Client', label: 'Client', minWidth: 170, format: (value: any) => value?.Name || '—' },
    { id: 'Status', label: 'Status', minWidth: 130 },
    { id: 'Priority', label: 'Priority', minWidth: 100 },
    { id: 'AssignedUser', label: 'Assigned To', minWidth: 170, format: (value: any) => value?.Name || '—' },
    {
      id: 'CreatedAt',
      label: 'Created',
      minWidth: 130,
      format: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : service ? (
        <>
          <DetailView
            title={`Service: ${service.Name}`}
            sections={serviceDetailSections}
            loading={loading}
            onEdit={handleEdit}
            onBack={handleBack}
            actions={
              <Button
                startIcon={<DeleteIcon />}
                variant="outlined"
                color="error"
                onClick={handleDelete}
                sx={{ ml: 1 }}
              >
                Delete
              </Button>
            }
          />

          <Box sx={{ width: '100%', mt: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="service tabs">
                <Tab label="Clients Using This Service" id="service-tab-0" aria-controls="service-tabpanel-0" />
                <Tab label="Opportunities" id="service-tab-1" aria-controls="service-tabpanel-1" />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              {loadingRelated ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <DataTable
                  columns={clientColumns}
                  data={clients}
                  title="Clients Using This Service"
                  onView={(row) => navigate(`/clients/${row.ClientID}`)}
                />
              )}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {loadingRelated ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <DataTable
                  columns={opportunityColumns}
                  data={opportunities}
                  title="Opportunities for This Service"
                  onView={(row) => navigate(`/opportunities/${row.OpportunityID}`)}
                />
              )}
            </TabPanel>
          </Box>
        </>
      ) : (
        <Alert severity="warning">Service not found</Alert>
      )}

      <FormDialog
        open={openForm}
        onClose={handleCloseForm}
        title="Edit Service"
        onSubmit={handleFormSubmit}
        isSubmitting={submitting}
        submitLabel="Update"
      >
        <ServiceForm service={service} onSubmit={handleFormSubmit} />
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

export default ServiceDetail;

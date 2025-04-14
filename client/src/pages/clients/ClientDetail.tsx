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
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DetailView from '../../components/common/DetailView';
import FormDialog from '../../components/common/FormDialog';
import DataTable from '../../components/common/DataTable';
import ClientForm from './ClientForm';
import clientService, { Client } from '../../services/api/clientService';

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
      id={`client-tabpanel-${index}`}
      aria-labelledby={`client-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [contacts, setContacts] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [engagements, setEngagements] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchClient = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await clientService.getById(id);
      setClient(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching client:', err);
      setError('Failed to load client details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedData = async () => {
    if (!id) return;
    
    setLoadingRelated(true);
    try {
      // Fetch contacts, opportunities, and engagements in parallel
      const [contactsData, opportunitiesData, engagementsData] = await Promise.all([
        clientService.getContacts(id),
        clientService.getOpportunities(id),
        clientService.getEngagements(id),
      ]);
      
      setContacts(contactsData);
      setOpportunities(opportunitiesData);
      setEngagements(engagementsData);
    } catch (err) {
      console.error('Error fetching related data:', err);
    } finally {
      setLoadingRelated(false);
    }
  };

  useEffect(() => {
    fetchClient();
    fetchRelatedData();
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setOpenForm(true);
  };

  const handleDelete = async () => {
    if (!client) return;
    
    if (window.confirm(`Are you sure you want to delete ${client.Name}?`)) {
      try {
        await clientService.delete(client.ClientID);
        setSnackbar({
          open: true,
          message: 'Client deleted successfully',
          severity: 'success',
        });
        // Navigate back to clients list after successful deletion
        navigate('/clients');
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
    if (!client) return;
    
    setSubmitting(true);
    try {
      await clientService.update(client.ClientID, formData);
      setSnackbar({
        open: true,
        message: 'Client updated successfully',
        severity: 'success',
      });
      setOpenForm(false);
      fetchClient();
    } catch (err) {
      console.error('Error updating client:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update client',
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
    navigate('/clients');
  };

  // Define client detail sections
  const clientDetailSections = client
    ? [
        {
          title: 'Client Information',
          fields: [
            { label: 'Name', value: client.Name },
            { label: 'Industry', value: client.Industry || '—' },
            { label: 'Region', value: client.Region || '—' },
            { label: 'Address', value: client.Address || '—', gridSize: 12 },
          ],
        },
        {
          title: 'Relationships',
          fields: [
            {
              label: 'Primary Account Manager',
              value: client.PrimaryAccountManager?.Name || '—',
            },
            {
              label: 'Primary Business Unit',
              value: client.PrimaryBusinessUnit?.Name || '—',
            },
          ],
        },
      ]
    : [];

  // Define columns for related data tables
  const contactColumns = [
    { id: 'Name', label: 'Name', minWidth: 170 },
    { id: 'JobTitle', label: 'Job Title', minWidth: 130 },
    { id: 'Email', label: 'Email', minWidth: 170 },
    { id: 'Phone', label: 'Phone', minWidth: 130 },
    { id: 'IsPrimary', label: 'Primary Contact', minWidth: 130, format: (value: boolean) => (value ? 'Yes' : 'No') },
  ];

  const opportunityColumns = [
    { id: 'Service', label: 'Service', minWidth: 170, format: (value: any) => value?.Name || '—' },
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

  const engagementColumns = [
    { id: 'Service', label: 'Service', minWidth: 170, format: (value: any) => value?.Name || '—' },
    { id: 'StartDate', label: 'Start Date', minWidth: 130, format: (value: string) => new Date(value).toLocaleDateString() },
    { id: 'EndDate', label: 'End Date', minWidth: 130, format: (value: string) => value ? new Date(value).toLocaleDateString() : '—' },
    { id: 'Status', label: 'Status', minWidth: 100 },
    { id: 'BusinessUnit', label: 'Business Unit', minWidth: 170, format: (value: any) => value?.Name || '—' },
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
      ) : client ? (
        <>
          <DetailView
            title={`Client: ${client.Name}`}
            sections={clientDetailSections}
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
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="client tabs">
                <Tab label="Contacts" id="client-tab-0" aria-controls="client-tabpanel-0" />
                <Tab label="Opportunities" id="client-tab-1" aria-controls="client-tabpanel-1" />
                <Tab label="Engagements" id="client-tab-2" aria-controls="client-tabpanel-2" />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              {loadingRelated ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <DataTable
                  columns={contactColumns}
                  data={contacts}
                  title="Client Contacts"
                  onView={() => {}}
                  onEdit={() => {}}
                  onDelete={() => {}}
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
                  title="Client Opportunities"
                  onView={(row) => navigate(`/opportunities/${row.OpportunityID}`)}
                />
              )}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              {loadingRelated ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <DataTable
                  columns={engagementColumns}
                  data={engagements}
                  title="Client Engagements"
                />
              )}
            </TabPanel>
          </Box>
        </>
      ) : (
        <Alert severity="warning">Client not found</Alert>
      )}

      <FormDialog
        open={openForm}
        onClose={handleCloseForm}
        title="Edit Client"
        onSubmit={handleFormSubmit}
        isSubmitting={submitting}
        submitLabel="Update"
      >
        <ClientForm client={client} onSubmit={handleFormSubmit} />
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

export default ClientDetail;

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  InputAdornment,
  SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Interface for client
interface Client {
  id: number;
  name: string;
}

// Interface for service
interface Service {
  id: number;
  name: string;
  bu: string;
}

// Interface for opportunity form data
interface OpportunityFormData {
  clientId: number;
  serviceId: number;
  status: string;
  priority: string;
  estimatedValue: string;
  expectedCloseDate: Date | null;
  notes: string;
}

// Interface for component props
interface NewOpportunityModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (opportunity: OpportunityFormData) => void;
  client: Client | null;
  service: Service | null;
  clients: Client[];
  services: Service[];
}

// Status options
const STATUS_OPTIONS = [
  'Identified',
  'In Discussion',
  'Proposal Sent',
  'On Hold'
];

// Priority options
const PRIORITY_OPTIONS = [
  'High',
  'Medium',
  'Low'
];

const NewOpportunityModal: React.FC<NewOpportunityModalProps> = ({
  open,
  onClose,
  onSave,
  client,
  service,
  clients,
  services
}) => {
  // Initialize form data
  const [formData, setFormData] = useState<OpportunityFormData>({
    clientId: client?.id || 0,
    serviceId: service?.id || 0,
    status: 'Identified',
    priority: 'Medium',
    estimatedValue: '',
    expectedCloseDate: null,
    notes: ''
  });

  // Handle form field changes
  const handleChange = (field: keyof OpportunityFormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Handle select changes
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    handleChange(name as keyof OpportunityFormData, value);
  };

  // Handle save
  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>New Cross-Sell Opportunity</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Client Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="client-select-label">Client</InputLabel>
              <Select
                labelId="client-select-label"
                id="client-select"
                name="clientId"
                value={formData.clientId.toString()}
                label="Client"
                onChange={handleSelectChange}
                disabled={!!client}
              >
                {clients.map((c) => (
                  <MenuItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Service Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="service-select-label">Service</InputLabel>
              <Select
                labelId="service-select-label"
                id="service-select"
                name="serviceId"
                value={formData.serviceId.toString()}
                label="Service"
                onChange={handleSelectChange}
                disabled={!!service}
              >
                {services.map((s) => (
                  <MenuItem key={s.id} value={s.id.toString()}>
                    {s.name} ({s.bu})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Status Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleSelectChange}
              >
                {STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Priority Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="priority-select-label">Priority</InputLabel>
              <Select
                labelId="priority-select-label"
                id="priority-select"
                name="priority"
                value={formData.priority}
                label="Priority"
                onChange={handleSelectChange}
              >
                {PRIORITY_OPTIONS.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Estimated Value */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Estimated Value"
              name="estimatedValue"
              value={formData.estimatedValue}
              onChange={(e) => handleChange('estimatedValue', e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              placeholder="e.g. 25,000"
            />
          </Grid>

          {/* Expected Close Date */}
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Expected Close Date"
                value={formData.expectedCloseDate}
                onChange={(date) => handleChange('expectedCloseDate', date)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              multiline
              rows={4}
              placeholder="Add any relevant details about this opportunity..."
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Create Opportunity
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewOpportunityModal;

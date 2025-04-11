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
  SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Interface for task form data
interface TaskFormData {
  description: string;
  dueDate: Date | null;
  priority: 'High' | 'Medium' | 'Low';
  assignee: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

// Interface for component props
interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: TaskFormData) => void;
  opportunityId: number;
}

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({
  open,
  onClose,
  onSave,
  opportunityId
}) => {
  // State for form data
  const [formData, setFormData] = useState<TaskFormData>({
    description: '',
    dueDate: new Date(),
    priority: 'Medium',
    assignee: '',
    status: 'Pending'
  });

  // State for validation
  const [errors, setErrors] = useState({
    description: false,
    assignee: false
  });

  // Handle form field changes
  const handleChange = (field: keyof TaskFormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });

    // Clear validation error when field is updated
    if (field === 'description' || field === 'assignee') {
      setErrors({
        ...errors,
        [field]: false
      });
    }
  };

  // Handle select changes
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    handleChange(name as keyof TaskFormData, value);
  };

  // Handle date change
  const handleDateChange = (date: Date | null) => {
    handleChange('dueDate', date);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors = {
      description: !formData.description.trim(),
      assignee: !formData.assignee.trim()
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  // Handle save
  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      // Reset form
      setFormData({
        description: '',
        dueDate: new Date(),
        priority: 'Medium',
        assignee: '',
        status: 'Pending'
      });
      onClose();
    }
  };

  // Handle close
  const handleClose = () => {
    // Reset form and errors
    setFormData({
      description: '',
      dueDate: new Date(),
      priority: 'Medium',
      assignee: '',
      status: 'Pending'
    });
    setErrors({
      description: false,
      assignee: false
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Task Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Task Description"
              name="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              error={errors.description}
              helperText={errors.description ? 'Description is required' : ''}
              placeholder="Enter task description..."
            />
          </Grid>

          {/* Due Date */}
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={formData.dueDate}
                onChange={handleDateChange}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Priority */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                id="priority"
                name="priority"
                value={formData.priority}
                label="Priority"
                onChange={handleSelectChange}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Assignee */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Assignee"
              name="assignee"
              value={formData.assignee}
              onChange={(e) => handleChange('assignee', e.target.value)}
              required
              error={errors.assignee}
              helperText={errors.assignee ? 'Assignee is required' : ''}
              placeholder="Enter assignee name..."
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Add Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskDialog;

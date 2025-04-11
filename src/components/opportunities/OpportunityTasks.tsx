import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Divider,
  Button,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Check as CheckIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import AddTaskDialog from './AddTaskDialog';

// Interface for task
interface Task {
  id: number;
  opportunityId: number;
  description: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  assignee: string;
}

// Interface for task form data
interface TaskFormData {
  description: string;
  dueDate: Date | null;
  priority: 'High' | 'Medium' | 'Low';
  assignee: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

// Interface for component props
interface OpportunityTasksProps {
  opportunityId: number;
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: number) => void;
}

// Sample mock data for testing
const mockTasks: Task[] = [
  {
    id: 1,
    opportunityId: 1,
    description: 'Schedule initial meeting with client',
    dueDate: '2023-07-15',
    status: 'Completed',
    priority: 'High',
    assignee: 'John Smith'
  },
  {
    id: 2,
    opportunityId: 1,
    description: 'Prepare proposal document',
    dueDate: '2023-07-20',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Sarah Johnson'
  },
  {
    id: 3,
    opportunityId: 1,
    description: 'Review proposal with team',
    dueDate: '2023-07-25',
    status: 'Pending',
    priority: 'Medium',
    assignee: 'Mike Wilson'
  }
];

const OpportunityTasks: React.FC<OpportunityTasksProps> = ({
  opportunityId,
  tasks = mockTasks, // Use mock data if no tasks provided
  onAddTask,
  onUpdateTask,
  onDeleteTask
}) => {
  // State for sort order
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // State for add task dialog
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Handle sort change
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as 'dueDate' | 'priority');
  };
  
  // Handle sort order change
  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  // Handle mark as complete
  const handleMarkAsComplete = (taskId: number) => {
    onUpdateTask(taskId, { status: 'Completed' });
  };
  
  // Handle open add task dialog
  const handleOpenAddTaskDialog = () => {
    setOpenAddTaskDialog(true);
  };
  
  // Handle close add task dialog
  const handleCloseAddTaskDialog = () => {
    setOpenAddTaskDialog(false);
  };
  
  // Handle save task
  const handleSaveTask = (taskFormData: TaskFormData) => {
    // Convert Date object to string format for API
    const dueDate = taskFormData.dueDate 
      ? taskFormData.dueDate.toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0];
    
    // Create task object
    const newTask = {
      opportunityId,
      description: taskFormData.description,
      dueDate,
      status: taskFormData.status,
      priority: taskFormData.priority,
      assignee: taskFormData.assignee
    };
    
    // Call onAddTask function
    onAddTask(newTask);
  };
  
  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'primary';
      case 'Pending':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  // Sort tasks
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      // Sort by priority (High > Medium > Low)
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      const priorityA = priorityOrder[a.priority] || 0;
      const priorityB = priorityOrder[b.priority] || 0;
      return sortOrder === 'asc' ? priorityA - priorityB : priorityB - priorityA;
    }
  });
  
  // Calculate days remaining or overdue
  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} remaining`;
    }
  };
  
  return (
    <Box>
      {/* Tasks Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Tasks</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by"
              value={sortBy}
              label="Sort By"
              onChange={handleSortChange}
            >
              <MenuItem value="dueDate">Due Date</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            size="small"
            onClick={handleSortOrderChange}
            sx={{ mr: 2 }}
          >
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddTaskDialog}
          >
            Add Task
          </Button>
        </Box>
      </Box>
      
      {/* Tasks List */}
      <Paper sx={{ p: 2, mb: 3, maxHeight: 400, overflow: 'auto' }}>
        <List>
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <React.Fragment key={task.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getStatusColor(task.status) as string }}>
                      <AssignmentIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                          sx={{ display: 'inline', mr: 1 }}
                          component="span"
                          variant="body1"
                          color="text.primary"
                        >
                          {task.description}
                        </Typography>
                        <Chip
                          label={task.priority}
                          color={getPriorityColor(task.priority) as any}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={task.status}
                          color={getStatusColor(task.status) as any}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'block' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Assignee: {task.assignee}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color={new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'error.main' : 'text.secondary'}
                        >
                          Due: {formatDate(task.dueDate)} ({getDaysRemaining(task.dueDate)})
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    {task.status !== 'Completed' && (
                      <IconButton
                        edge="end"
                        aria-label="complete"
                        onClick={() => handleMarkAsComplete(task.id)}
                        sx={{ mr: 1 }}
                      >
                        <CheckIcon color="success" />
                      </IconButton>
                    )}
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => alert(`Edit task ${task.id}`)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => onDeleteTask(task.id)}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body1" color="text.secondary">
                No tasks yet. Add the first task using the button above.
              </Typography>
            </Box>
          )}
        </List>
      </Paper>
      
      {/* Add Task Dialog */}
      <AddTaskDialog
        open={openAddTaskDialog}
        onClose={handleCloseAddTaskDialog}
        onSave={handleSaveTask}
        opportunityId={opportunityId}
      />
    </Box>
  );
};

export default OpportunityTasks;
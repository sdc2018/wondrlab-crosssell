import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Chip, 
  Box,
  IconButton,
  Checkbox,
  Tooltip,
  Divider
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

// In a real application, this would come from an API
const mockTasks = [
  {
    id: 1,
    description: 'Schedule follow-up meeting with TechCorp',
    dueDate: '2023-07-15',
    status: 'Completed',
    opportunityId: 1,
    opportunityName: 'Video Production for TechCorp'
  },
  {
    id: 2,
    description: 'Prepare video production proposal',
    dueDate: '2023-07-25',
    status: 'In Progress',
    opportunityId: 1,
    opportunityName: 'Video Production for TechCorp'
  },
  {
    id: 3,
    description: 'Follow up on proposal',
    dueDate: '2023-07-20',
    status: 'Pending',
    opportunityId: 2,
    opportunityName: 'Performance Marketing for TechCorp'
  },
  {
    id: 4,
    description: 'Prepare initial content strategy outline',
    dueDate: '2023-07-18',
    status: 'Pending',
    opportunityId: 3,
    opportunityName: 'Content Strategy for Fashion Forward'
  },
  {
    id: 5,
    description: 'Schedule presentation meeting',
    dueDate: '2023-07-25',
    status: 'Pending',
    opportunityId: 3,
    opportunityName: 'Content Strategy for Fashion Forward'
  }
];

const TaskList: React.FC = () => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return '#4caf50'; // green
      case 'In Progress':
        return '#2196f3'; // blue
      case 'Pending':
        return '#ff9800'; // orange
      default:
        return '#757575'; // grey
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'Completed';
  };

  const handleTaskClick = (id: number) => {
    navigate(`/tasks/${id}`);
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {mockTasks.map((task, index) => (
        <React.Fragment key={task.id}>
          <ListItem 
            alignItems="flex-start"
            secondaryAction={
              <Tooltip title="View Details">
                <IconButton 
                  edge="end" 
                  aria-label="view" 
                  onClick={() => handleTaskClick(task.id)}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Tooltip>
            }
          >
            <Checkbox 
              checked={task.status === 'Completed'} 
              sx={{ 
                mr: 1,
                color: task.status === 'Completed' ? '#4caf50' : 
                       isOverdue(task.dueDate, task.status) ? '#f44336' : undefined
              }}
            />
            <ListItemText
              primary={
                <Typography 
                  variant="subtitle1" 
                  component="div"
                  sx={{ 
                    textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                    color: isOverdue(task.dueDate, task.status) ? '#f44336' : undefined
                  }}
                >
                  {task.description}
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Box sx={{ display: 'flex', mt: 1, flexWrap: 'wrap', gap: 1 }}>
                    <Chip 
                      label={task.status} 
                      size="small" 
                      sx={{ 
                        bgcolor: getStatusColor(task.status),
                        color: 'white'
                      }} 
                    />
                    {isOverdue(task.dueDate, task.status) && (
                      <Chip 
                        label="Overdue" 
                        size="small" 
                        sx={{ bgcolor: '#f44336', color: 'white' }} 
                      />
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    For: {task.opportunityName}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          {index < mockTasks.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default TaskList;

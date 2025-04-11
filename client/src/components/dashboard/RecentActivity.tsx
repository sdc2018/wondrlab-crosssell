import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Typography,
  Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NoteIcon from '@mui/icons-material/Note';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// In a real application, this would come from an API
const mockActivities = [
  {
    id: 1,
    type: 'opportunity',
    action: 'created',
    subject: 'Video Production opportunity for TechCorp',
    user: 'John Smith',
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    type: 'note',
    action: 'added',
    subject: 'Follow-up meeting scheduled for next week',
    user: 'Sarah Johnson',
    timestamp: '3 hours ago'
  },
  {
    id: 3,
    type: 'task',
    action: 'completed',
    subject: 'Prepare proposal for Fashion Forward',
    user: 'Mike Wilson',
    timestamp: '5 hours ago'
  },
  {
    id: 4,
    type: 'client',
    action: 'updated',
    subject: 'Food Delights contact information',
    user: 'Emily Davis',
    timestamp: '1 day ago'
  },
  {
    id: 5,
    type: 'opportunity',
    action: 'status changed',
    subject: 'Digital Media Planning for Finance Plus (Proposal Sent)',
    user: 'Alex Thompson',
    timestamp: '1 day ago'
  }
];

const RecentActivity: React.FC = () => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <AssignmentIcon />;
      case 'note':
        return <NoteIcon />;
      case 'task':
        return <CheckCircleIcon />;
      case 'client':
        return <PersonIcon />;
      default:
        return <NoteIcon />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return '#2196f3'; // blue
      case 'note':
        return '#ff9800'; // orange
      case 'task':
        return '#4caf50'; // green
      case 'client':
        return '#9c27b0'; // purple
      default:
        return '#757575'; // grey
    }
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {mockActivities.map((activity, index) => (
        <React.Fragment key={activity.id}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: getActivityColor(activity.type) }}>
                {getActivityIcon(activity.type)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={activity.subject}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {activity.user}
                  </Typography>
                  {` ${activity.action} this ${activity.timestamp}`}
                </React.Fragment>
              }
            />
          </ListItem>
          {index < mockActivities.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default RecentActivity;

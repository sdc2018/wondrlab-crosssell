import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Chip, 
  Box,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

// In a real application, this would come from an API
const mockOpportunities = [
  {
    id: 1,
    clientName: 'TechCorp',
    serviceName: 'Video Production',
    status: 'In Discussion',
    priority: 'High',
    value: '$15,000',
    dueDate: '2023-08-30'
  },
  {
    id: 2,
    clientName: 'TechCorp',
    serviceName: 'Performance Marketing',
    status: 'Proposal Sent',
    priority: 'Medium',
    value: '$25,000',
    dueDate: '2023-09-15'
  },
  {
    id: 3,
    clientName: 'Fashion Forward',
    serviceName: 'Content Strategy',
    status: 'Identified',
    priority: 'Low',
    value: '$10,000',
    dueDate: '2023-10-01'
  },
  {
    id: 4,
    clientName: 'Finance Plus',
    serviceName: 'Digital Media Planning',
    status: 'Proposal Sent',
    priority: 'Medium',
    value: '$20,000',
    dueDate: '2023-07-20'
  }
];

const OpportunityList: React.FC = () => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Identified':
        return '#757575'; // grey
      case 'In Discussion':
        return '#2196f3'; // blue
      case 'Proposal Sent':
        return '#ff9800'; // orange
      case 'On Hold':
        return '#f44336'; // red
      case 'Won':
        return '#4caf50'; // green
      case 'Lost':
        return '#9e9e9e'; // dark grey
      default:
        return '#757575'; // grey
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return '#f44336'; // red
      case 'Medium':
        return '#ff9800'; // orange
      case 'Low':
        return '#4caf50'; // green
      default:
        return '#757575'; // grey
    }
  };

  const handleOpportunityClick = (id: number) => {
    navigate(`/opportunities/${id}`);
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {mockOpportunities.map((opportunity, index) => (
        <React.Fragment key={opportunity.id}>
          <ListItem 
            alignItems="flex-start"
            secondaryAction={
              <Tooltip title="View Details">
                <IconButton 
                  edge="end" 
                  aria-label="view" 
                  onClick={() => handleOpportunityClick(opportunity.id)}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Tooltip>
            }
          >
            <ListItemText
              primary={
                <Typography variant="subtitle1" component="div">
                  {opportunity.clientName} - {opportunity.serviceName}
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Box sx={{ display: 'flex', mt: 1, flexWrap: 'wrap', gap: 1 }}>
                    <Chip 
                      label={opportunity.status} 
                      size="small" 
                      sx={{ 
                        bgcolor: getStatusColor(opportunity.status),
                        color: 'white'
                      }} 
                    />
                    <Chip 
                      label={opportunity.priority} 
                      size="small" 
                      sx={{ 
                        bgcolor: getPriorityColor(opportunity.priority),
                        color: 'white'
                      }} 
                    />
                    <Chip 
                      label={opportunity.value} 
                      size="small" 
                      variant="outlined" 
                    />
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Due: {new Date(opportunity.dueDate).toLocaleDateString()}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          {index < mockOpportunities.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default OpportunityList;

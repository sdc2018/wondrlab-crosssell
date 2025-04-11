import React from 'react';
import { Paper, Box, Typography, SxProps, Theme } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TaskIcon from '@mui/icons-material/Task';
import CelebrationIcon from '@mui/icons-material/Celebration';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: 'opportunity' | 'task' | 'celebration' | 'money';
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  color 
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'opportunity':
        return <AssignmentIcon sx={{ fontSize: 40, color }} />;
      case 'task':
        return <TaskIcon sx={{ fontSize: 40, color }} />;
      case 'celebration':
        return <CelebrationIcon sx={{ fontSize: 40, color }} />;
      case 'money':
        return <MonetizationOnIcon sx={{ fontSize: 40, color }} />;
      default:
        return <AssignmentIcon sx={{ fontSize: 40, color }} />;
    }
  };

  return (
    <Paper 
      elevation={2}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        height: '100%'
      }}
    >
      <Box sx={{ mr: 2 }}>
        {getIcon()}
      </Box>
      <Box>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
    </Paper>
  );
};

export default DashboardCard;

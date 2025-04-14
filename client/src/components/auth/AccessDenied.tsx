import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../data/sampleData';

interface AccessDeniedProps {
  requiredRoles: UserRole[];
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ requiredRoles }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 600,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" paragraph>
          You don't have permission to access this page.
        </Typography>
        <Typography variant="body2" paragraph>
          Required role(s): {requiredRoles.join(', ')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2 }}
        >
          Go to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default AccessDenied;

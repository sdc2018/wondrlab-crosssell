import React from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Divider 
} from '@mui/material';
import DashboardCard from '../../components/dashboard/DashboardCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import OpportunityList from '../../components/dashboard/OpportunityList';
import TaskList from '../../components/dashboard/TaskList';

const DashboardPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {/* KPI Summary Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flexBasis: { xs: '100%', sm: '47%', md: '23%' } }}>
          <DashboardCard 
            title="Open Opportunities" 
            value="12" 
            icon="opportunity"
            color="#4caf50"
          />
        </Box>
        <Box sx={{ flexBasis: { xs: '100%', sm: '47%', md: '23%' } }}>
          <DashboardCard 
            title="Pending Tasks" 
            value="5" 
            icon="task"
            color="#ff9800"
          />
        </Box>
        <Box sx={{ flexBasis: { xs: '100%', sm: '47%', md: '23%' } }}>
          <DashboardCard 
            title="Won This Month" 
            value="3" 
            icon="celebration"
            color="#2196f3"
          />
        </Box>
        <Box sx={{ flexBasis: { xs: '100%', sm: '47%', md: '23%' } }}>
          <DashboardCard 
            title="Potential Revenue" 
            value="$45K" 
            icon="money"
            color="#9c27b0"
          />
        </Box>
      </Box>
      
      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* My Open Opportunities */}
        <Box sx={{ flexBasis: { xs: '100%', md: '48%' } }}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              My Open Opportunities
            </Typography>
            <OpportunityList />
          </Paper>
        </Box>
        
        {/* My Tasks */}
        <Box sx={{ flexBasis: { xs: '100%', md: '48%' } }}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              My Tasks
            </Typography>
            <TaskList />
          </Paper>
        </Box>
        
        {/* Recent Activity Feed */}
        <Box sx={{ flexBasis: '100%' }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <RecentActivity />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  Button
} from '@mui/material';
import {
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon
} from '@mui/icons-material';

// Mock data for dashboard metrics
const mockMetrics = {
  openOpportunities: 12,
  activeClients: 8,
  potentialRevenue: '$230,000',
  recentWins: 3,
  conversionRate: '25%',
  avgDaysToClose: 45
};

// Mock data for recent activities
const mockActivities = [
  {
    id: 1,
    type: 'opportunity_created',
    user: 'Sarah Johnson',
    client: 'TechCorp',
    service: 'Digital Marketing',
    timestamp: '2023-06-15T14:30:00'
  },
  {
    id: 2,
    type: 'opportunity_status_changed',
    user: 'John Smith',
    client: 'Fashion Forward',
    service: 'Video Production',
    oldStatus: 'In Discussion',
    newStatus: 'Proposal Sent',
    timestamp: '2023-06-14T11:15:00'
  },
  {
    id: 3,
    type: 'opportunity_won',
    user: 'Mike Wilson',
    client: 'Food Delights',
    service: 'Content Strategy',
    value: '$50,000',
    timestamp: '2023-06-12T09:45:00'
  },
  {
    id: 4,
    type: 'note_added',
    user: 'Sarah Johnson',
    client: 'TechCorp',
    content: 'Client expressed interest in expanding services in Q3',
    timestamp: '2023-06-10T16:20:00'
  },
  {
    id: 5,
    type: 'task_completed',
    user: 'John Smith',
    task: 'Send proposal to Fashion Forward',
    timestamp: '2023-06-09T10:30:00'
  }
];

// Mock data for upcoming tasks
const mockTasks = [
  {
    id: 1,
    description: 'Follow up with TechCorp on Digital Marketing proposal',
    dueDate: '2023-06-20',
    priority: 'High',
    client: 'TechCorp'
  },
  {
    id: 2,
    description: 'Prepare presentation for Food Delights',
    dueDate: '2023-06-22',
    priority: 'Medium',
    client: 'Food Delights'
  },
  {
    id: 3,
    description: 'Schedule meeting with Finance Plus',
    dueDate: '2023-06-25',
    priority: 'Low',
    client: 'Finance Plus'
  }
];

// Mock data for recent clients
const mockRecentClients = [
  {
    id: 1,
    name: 'TechCorp',
    industry: 'Technology',
    activeServices: 2,
    potentialServices: 3
  },
  {
    id: 2,
    name: 'Fashion Forward',
    industry: 'Fashion',
    activeServices: 1,
    potentialServices: 4
  },
  {
    id: 3,
    name: 'Food Delights',
    industry: 'Food & Beverage',
    activeServices: 1,
    potentialServices: 2
  }
];

const Dashboard: React.FC = () => {
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'opportunity_created':
        return <AssignmentIcon />;
      case 'opportunity_status_changed':
        return <TrendingUpIcon />;
      case 'opportunity_won':
        return <CheckCircleIcon />;
      case 'note_added':
        return <PersonIcon />;
      case 'task_completed':
        return <CheckCircleIcon />;
      default:
        return <AssignmentIcon />;
    }
  };

  // Get activity text based on type
  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'opportunity_created':
        return `${activity.user} created a new opportunity for ${activity.client} (${activity.service})`;
      case 'opportunity_status_changed':
        return `${activity.user} changed status of ${activity.client} opportunity from "${activity.oldStatus}" to "${activity.newStatus}"`;
      case 'opportunity_won':
        return `${activity.user} won the ${activity.client} opportunity (${activity.service}) worth ${activity.value}`;
      case 'note_added':
        return `${activity.user} added a note to ${activity.client}: "${activity.content}"`;
      case 'task_completed':
        return `${activity.user} completed task: ${activity.task}`;
      default:
        return 'Unknown activity';
    }
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Open Opportunities
              </Typography>
              <Typography variant="h4">
                {mockMetrics.openOpportunities}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Active Clients
              </Typography>
              <Typography variant="h4">
                {mockMetrics.activeClients}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Potential Revenue
              </Typography>
              <Typography variant="h4">
                {mockMetrics.potentialRevenue}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Recent Wins
              </Typography>
              <Typography variant="h4">
                {mockMetrics.recentWins}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Conversion Rate
              </Typography>
              <Typography variant="h4">
                {mockMetrics.conversionRate}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Avg. Days to Close
              </Typography>
              <Typography variant="h4">
                {mockMetrics.avgDaysToClose}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Main Dashboard Content */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Activity</Typography>
            </Box>
            <List>
              {mockActivities.map((activity) => (
                <React.Fragment key={activity.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={getActivityText(activity)}
                      secondary={
                        <React.Fragment>
                          {formatDate(activity.timestamp)} at {formatTime(activity.timestamp)}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="text">View All Activity</Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Right Column - Upcoming Tasks and Recent Clients */}
        <Grid item xs={12} md={6}>
          {/* Upcoming Tasks */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Upcoming Tasks</Typography>
            <List>
              {mockTasks.map((task) => (
                <React.Fragment key={task.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <AccessTimeIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={task.description}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {task.client}
                          </Typography>
                          {` — Due: ${formatDate(task.dueDate)}`}
                          <Chip 
                            size="small" 
                            label={task.priority} 
                            color={getPriorityColor(task.priority) as any}
                            sx={{ ml: 1 }}
                          />
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="text">View All Tasks</Button>
            </Box>
          </Paper>
          
          {/* Recent Clients */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Clients</Typography>
            <List>
              {mockRecentClients.map((client) => (
                <React.Fragment key={client.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <BusinessIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={client.name}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {client.industry}
                          </Typography>
                          {` — Active Services: ${client.activeServices}, Potential: ${client.potentialServices}`}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="text">View All Clients</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

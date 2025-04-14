import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MainLayout from './components/layout/MainLayout';
import ClientList from './pages/clients/ClientList';
import ClientDetail from './pages/clients/ClientDetail';
import ServiceList from './pages/services/ServiceList';
import ServiceDetail from './pages/services/ServiceDetail';

// Placeholder components - these will be replaced with actual components later
const Dashboard = () => <div>Dashboard</div>;
const MatrixView = () => <div>Cross-Sell Matrix</div>;
const OpportunityList = () => <div>Opportunity List</div>;
const OpportunityDetail = () => <div>Opportunity Detail</div>;
const TaskList = () => <div>Task List</div>;
const MyTasks = () => <div>My Tasks</div>;
const Reports = () => <div>Reports</div>;
const Login = () => <div>Login</div>;

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  // Placeholder for authentication state
  const isAuthenticated = true; // This will be replaced with actual auth logic

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          {isAuthenticated ? (
            <>
              <Route 
                path="/dashboard" 
                element={
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                } 
              />
              <Route 
                path="/clients" 
                element={
                  <MainLayout>
                    <ClientList />
                  </MainLayout>
                } 
              />
              <Route 
                path="/clients/:id" 
                element={
                  <MainLayout>
                    <ClientDetail />
                  </MainLayout>
                } 
              />
              <Route 
                path="/services" 
                element={
                  <MainLayout>
                    <ServiceList />
                  </MainLayout>
                } 
              />
              <Route 
                path="/services/:id" 
                element={
                  <MainLayout>
                    <ServiceDetail />
                  </MainLayout>
                } 
              />
              <Route 
                path="/matrix" 
                element={
                  <MainLayout>
                    <MatrixView />
                  </MainLayout>
                } 
              />
              <Route 
                path="/opportunities" 
                element={
                  <MainLayout>
                    <OpportunityList />
                  </MainLayout>
                } 
              />
              <Route 
                path="/opportunities/:id" 
                element={
                  <MainLayout>
                    <OpportunityDetail />
                  </MainLayout>
                } 
              />
              <Route 
                path="/tasks" 
                element={
                  <MainLayout>
                    <TaskList />
                  </MainLayout>
                } 
              />
              <Route 
                path="/my-tasks" 
                element={
                  <MainLayout>
                    <MyTasks />
                  </MainLayout>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <MainLayout>
                    <Reports />
                  </MainLayout>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

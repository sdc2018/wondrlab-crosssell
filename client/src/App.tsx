import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MainLayout from './components/layout/MainLayout';
import ClientList from './pages/clients/ClientList';
import ClientDetail from './pages/clients/ClientDetail';
import ServiceList from './pages/services/ServiceList';
import ServiceDetail from './pages/services/ServiceDetail';
import { AuthProvider, useAuth } from './contexts/auth/AuthContext';
import Login from './pages/auth/Login';
import { UserManagement } from './pages/users';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { UserRole } from './data/sampleData';

// Placeholder components - these will be replaced with actual components later
const Dashboard = () => <div>Dashboard</div>;
const MatrixView = () => <div>Cross-Sell Matrix</div>;
const OpportunityList = () => <div>Opportunity List</div>;
const OpportunityDetail = () => <div>Opportunity Detail</div>;
const TaskList = () => <div>Task List</div>;
const MyTasks = () => <div>My Tasks</div>;
const Reports = () => <div>Reports</div>;

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

// AppRoutes component to use auth context
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
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
          <Route 
            path="/users" 
            element={
              <MainLayout>
                <UserManagement />
              </MainLayout>
            } 
          />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
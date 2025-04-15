import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/AuthContext';
import { UserRole } from '../../data/sampleData';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

/**
 * A component that protects routes based on authentication and role-based access control.
 * It checks if the user is authenticated and has the required role to access the route.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const { isAuthenticated, user, hasRole } = useAuth();

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If there are required roles and the user doesn't have any of them, redirect to dashboard
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is authenticated and has the required role, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
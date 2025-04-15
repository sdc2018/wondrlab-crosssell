# Testing Documentation for Wondrlab Cross-Sell Management System

This document outlines the testing strategy, implementation details, and instructions for running tests in the Wondrlab Cross-Sell Management System.

## Table of Contents

1. [Testing Strategy](#testing-strategy)
2. [Testing Frameworks and Libraries](#testing-frameworks-and-libraries)
3. [Directory Structure](#directory-structure)
4. [Running Tests](#running-tests)
5. [Writing New Tests](#writing-new-tests)
6. [Code Coverage](#code-coverage)
7. [Continuous Integration](#continuous-integration)

## Testing Strategy

The Wondrlab Cross-Sell Management System follows a comprehensive testing approach that includes:

### Frontend Testing

- **Component Tests**: Verify that individual React components render correctly and respond appropriately to user interactions
- **Integration Tests**: Ensure that components work together as expected
- **Hook Tests**: Validate custom React hooks functionality
- **State Management Tests**: Verify that application state is managed correctly

### Backend Testing

- **Unit Tests**: Test individual functions and methods in isolation
- **Service Tests**: Validate business logic in service layers
- **API Tests**: Ensure API endpoints handle requests and responses correctly
- **Database Tests**: Verify data persistence operations

### End-to-End Testing

- Simulate real user scenarios across the entire application
- Validate critical user flows and business processes

## Testing Frameworks and Libraries

### Frontend Testing

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **Mock Service Worker**: API mocking for frontend tests

### Backend Testing

- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertions for API testing
- **MongoDB Memory Server**: In-memory MongoDB for database testing

## Directory Structure

### Frontend Tests

```
client/
├── src/
│   ├── components/
│   │   ├── Component.tsx
│   │   └── Component.test.tsx  # Component tests alongside components
│   ├── pages/
│   │   ├── Page.tsx
│   │   └── Page.test.tsx       # Page component tests
│   ├── services/
│   │   ├── service.ts
│   │   └── service.test.ts     # Frontend service tests
│   └── utils/
│       ├── util.ts
│       └── util.test.ts        # Utility function tests
```

### Backend Tests

```
server/
├── src/
│   ├── controllers/
│   │   ├── controller.ts
│   │   └── controller.test.ts  # Controller tests
│   ├── services/
│   │   ├── service.ts
│   │   └── service.test.ts     # Service unit tests
│   ├── models/
│   │   ├── model.ts
│   │   └── model.test.ts       # Model tests
│   └── routes/
│       ├── route.ts
│       └── route.test.ts       # API endpoint tests
├── tests/
│   └── integration/            # Integration tests across modules
```

## Running Tests

### Frontend Tests

To run frontend tests, navigate to the client directory and use the following commands:

```bash
# Navigate to client directory
cd client

# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Backend Tests

To run backend tests, navigate to the server directory and use the following commands:

```bash
# Navigate to server directory
cd server

# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Writing New Tests

### Frontend Component Test Example

Here's an example of a test for the CrossSellMatrix component:

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CrossSellMatrix } from './CrossSellMatrix';
import { AuthContext } from '../../contexts/AuthContext';

// Mock the AuthContext
const mockAuthContext = {
  user: { id: '1', name: 'Test User', role: 'Admin' },
  isAuthenticated: true
};

test('renders the matrix with clients and services', async () => {
  render(
    <AuthContext.Provider value={mockAuthContext}>
      <CrossSellMatrix />
    </AuthContext.Provider>
  );

  // Check if clients are rendered
  expect(screen.getByText('Client A')).toBeInTheDocument();
  
  // Check if services are rendered
  expect(screen.getByText('Service 1')).toBeInTheDocument();
});
```

### Backend Service Test Example

Here's an example of a test for the authentication service:

```typescript
import { AuthService } from '../authService';
import { UserModel } from '../../models/User';
import bcrypt from 'bcryptjs';

// Mock dependencies
jest.mock('../../models/User');
jest.mock('bcryptjs');

describe('AuthService', () => {
  let authService;
  
  beforeEach(() => {
    authService = new AuthService();
  });
  
  describe('loginUser', () => {
    it('should return a token if credentials are valid', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const user = {
        _id: 'user_id',
        email: 'test@example.com',
        password: 'hashed_password'
      };
      
      UserModel.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      
      // Act
      const result = await authService.loginUser(loginData);
      
      // Assert
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
    });
  });
});
```

### API Endpoint Test Example

Here's an example of a test for a client API endpoint:

```typescript
import request from 'supertest';
import express from 'express';
import { clientRoutes } from '../clientRoutes';
import { ClientModel } from '../../models/Client';

// Mock dependencies
jest.mock('../../models/Client');

describe('Client API Routes', () => {
  let app;
  
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/clients', clientRoutes);
  });
  
  describe('GET /api/clients', () => {
    it('should return all clients', async () => {
      // Arrange
      const mockClients = [
        { _id: 'client1', name: 'Client 1' },
        { _id: 'client2', name: 'Client 2' }
      ];
      
      ClientModel.find.mockResolvedValue(mockClients);
      
      // Act
      const response = await request(app).get('/api/clients');
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockClients);
    });
  });
});
```

## Code Coverage

The project aims to maintain a minimum of 70% code coverage for both frontend and backend code. Coverage reports are generated when running tests with the coverage option:

```bash
npm run test:coverage
```

The coverage thresholds are configured in the Jest configuration files:

```javascript
// jest.config.js
module.exports = {
  // ... other configuration
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

## Continuous Integration

The project uses GitHub Actions for continuous integration. Tests are automatically run on:

- Pull requests to the main branch
- Pushes to the main branch

The CI pipeline:
1. Installs dependencies
2. Runs linting checks
3. Runs tests with coverage
4. Fails if tests fail or coverage thresholds are not met

This ensures that all code changes maintain the required quality standards before being merged into the main codebase.

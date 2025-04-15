import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CrossSellMatrix } from './CrossSellMatrix';
import { AuthContext } from '../../contexts/AuthContext';
import { mockClients, mockServices, mockOpportunities } from '../../__mocks__/data';

// Mock the API service
jest.mock('../../services/api', () => ({
  getClients: jest.fn(() => Promise.resolve(mockClients)),
  getServices: jest.fn(() => Promise.resolve(mockServices)),
  getOpportunities: jest.fn(() => Promise.resolve(mockOpportunities)),
  updateOpportunity: jest.fn((id, data) => Promise.resolve({ ...data, id }))
}));

const mockAuthContext = {
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'Management'
  },
  isAuthenticated: true,
  loading: false,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn()
};

describe('CrossSellMatrix Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the matrix with clients and services', async () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <CrossSellMatrix />
      </AuthContext.Provider>
    );

    // Check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check if clients are rendered
    mockClients.forEach(client => {
      expect(screen.getByText(client.name)).toBeInTheDocument();
    });

    // Check if services are rendered
    mockServices.forEach(service => {
      expect(screen.getByText(service.name)).toBeInTheDocument();
    });

    // Check if the matrix has the correct number of cells
    const cells = screen.getAllByTestId('matrix-cell');
    expect(cells.length).toBe(mockClients.length * mockServices.length);
  });

  test('updates opportunity status when cell is clicked', async () => {
    const apiService = require('../../services/api');

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <CrossSellMatrix />
      </AuthContext.Provider>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Find a cell and click it
    const cells = screen.getAllByTestId('matrix-cell');
    fireEvent.click(cells[0]);

    // Check if status selection popup appears
    expect(screen.getByText(/select status/i)).toBeInTheDocument();

    // Select a new status
    fireEvent.click(screen.getByText(/in progress/i));

    // Check if the API was called to update the opportunity
    await waitFor(() => {
      expect(apiService.updateOpportunity).toHaveBeenCalled();
    });

    // Check if the cell color has changed to reflect the new status
    expect(cells[0]).toHaveClass('status-in-progress');
  });

  test('displays opportunity details when hovering over a cell', async () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <CrossSellMatrix />
      </AuthContext.Provider>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Find a cell and hover over it
    const cells = screen.getAllByTestId('matrix-cell');
    fireEvent.mouseOver(cells[0]);

    // Check if opportunity details tooltip appears
    expect(screen.getByTestId('opportunity-tooltip')).toBeInTheDocument();
    expect(screen.getByText(/opportunity score/i)).toBeInTheDocument();
  });

  test('filters matrix data when filter options are selected', async () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <CrossSellMatrix />
      </AuthContext.Provider>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Find and click the filter button
    fireEvent.click(screen.getByText(/filter/i));

    // Select a business unit filter
    fireEvent.click(screen.getByLabelText(/business unit/i));
    fireEvent.click(screen.getByText('Digital'));

    // Apply the filter
    fireEvent.click(screen.getByText(/apply/i));

    // Check if the matrix has been filtered
    const cells = screen.getAllByTestId('matrix-cell');
    expect(cells.length).toBeLessThan(mockClients.length * mockServices.length);
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Wondrlab Cross-Sell application', () => {
  render(<App />);
  // Look for text that actually exists in the App component
  const appElement = screen.getByText(/Wondrlab Cross-Sell/i) || screen.getByText(/Login/i);
  expect(appElement).toBeInTheDocument();
});
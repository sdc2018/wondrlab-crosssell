# Wondrlab Cross-Sell Opportunity Management System

A web-based application designed to centralize client and service data across Wondrlab's Business Units and facilitate the identification, tracking, and execution of cross-sell opportunities.

## Project Overview

The Wondrlab Cross-Sell Opportunity Management System helps break down silos between departments, improve inter-BU collaboration, and ultimately increase client value and overall revenue through effective cross-selling.

### Key Features

- **Cross-Sell Matrix**: Interactive grid view showing clients vs. services with color-coded cells indicating relationship status
- **Client Management**: Comprehensive client information management with filtering and import/export
- **Service Catalog**: Business Unit service offerings management with categorization
- **Opportunity Management**: End-to-end tracking of cross-selling opportunities from identification to close
- **Task Management**: Assignment and tracking of tasks associated with opportunities
- **Dashboard**: Personalized overview with KPIs, activity feeds, and upcoming tasks
- **Import/Export**: CSV data import/export functionality across all modules

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Material-UI (MUI)
- **State Management**: React Hooks
- **Routing**: React Router
- **Data Visualization**: MUI components

## Project Structure

```
wondrlab-crosssell/
├── public/                 # Static files
├── src/
│   ├── components/         # Reusable components
│   │   ├── clients/        # Client-related components
│   │   ├── opportunities/  # Opportunity-related components
│   │   ├── services/       # Service-related components
│   │   └── common/         # Common UI components
│   ├── pages/              # Page components
│   │   ├── dashboard/      # Dashboard page
│   │   ├── clients/        # Client management pages
│   │   ├── services/       # Service catalog pages
│   │   ├── matrix/         # Cross-sell matrix pages
│   │   └── opportunities/  # Opportunity management pages
│   ├── models/             # TypeScript interfaces
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main App component
│   └── index.tsx           # Entry point
└── package.json            # Dependencies and scripts
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd wondrlab-crosssell
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```
   npm start
   # or
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser

## Module Descriptions

### Dashboard

The Dashboard provides a personalized landing page with:
- Key performance indicators (KPIs)
- Recent activity feed
- Upcoming tasks
- Quick access to recently viewed clients/opportunities

### Client Management

The Client Management module allows users to:
- View a list of clients with filtering and search
- Add, edit, and manage client information
- View client details including contacts, active engagements, and opportunities
- Import/export client data via CSV

### Service Catalog

The Service Catalog module enables users to:
- View services categorized by Business Unit
- Add, edit, and manage service offerings
- Activate/deactivate services
- Import/export service data via CSV

### Cross-Sell Matrix

The Cross-Sell Matrix provides:
- A grid view with clients as rows and services as columns
- Color-coded cells indicating relationship status:
  - Active engagement (green)
  - Open opportunity (blue)
  - Closed/lost opportunity (red)
  - Potential opportunity (yellow)
- Interactive cells for creating new opportunities or viewing existing ones
- Filtering options for clients and services
- Import/export functionality for CSV data

### Opportunity Management

The Opportunity Management module allows users to:
- View a list of opportunities with filtering and search
- Add, edit, and manage opportunity details
- Track opportunity status through the sales pipeline
- Assign opportunities to team members
- Import/export opportunity data via CSV

### Task Management

The Task Management module enables users to:
- Create and assign tasks related to opportunities
- Set due dates and priorities
- Track task status and completion
- Sort tasks by due date and priority

## Next Steps

1. **Backend Integration**: Connect the frontend to a backend API for data persistence
2. **Authentication**: Implement user authentication and authorization
3. **Advanced Filtering**: Add more advanced filtering options across all modules
4. **Reporting**: Develop detailed reporting and analytics features
5. **Email Notifications**: Implement email notifications for important events
6. **Mobile Optimization**: Enhance mobile responsiveness for field use

## Sample Data

The application includes sample mock data for testing purposes. In a production environment, this would be replaced with real data from the backend API.

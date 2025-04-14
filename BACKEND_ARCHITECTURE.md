# Wondrlab Cross-Sell Opportunity Management System - Backend Architecture

## Overview
The backend for the Wondrlab Cross-Sell Opportunity Management System is implemented using TypeScript, Express.js, PostgreSQL, and TypeORM, as specified in the PRD. This document outlines the current architecture and how it aligns with the requirements.

## Technology Stack
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (planned)

## Directory Structure
```
server/
├── src/
│   ├── config/
│   │   └── database.ts       # Database connection configuration
│   ├── models/               # TypeORM entity models
│   │   ├── BusinessUnit.ts
│   │   ├── Client.ts
│   │   ├── ClientContact.ts
│   │   ├── Engagement.ts
│   │   ├── Note.ts
│   │   ├── Opportunity.ts
│   │   ├── Service.ts
│   │   ├── Task.ts
│   │   └── User.ts
│   ├── index.ts              # Main application entry point
│   └── seed.ts               # Database seeding script
```

## Data Models

### BusinessUnit
Represents organizational divisions within Wondrlab that offer specific services.
- Fields: BU_ID (UUID), Name, Description, LeadUserID, IsActive
- Relationships:
  - One-to-Many with Service (each BU offers multiple services)
  - Many-to-One with User (each BU has a lead user)
  - One-to-Many with User (each BU has multiple associated users)

### Client
Represents client organizations that engage with Wondrlab's services.
- Fields: ClientID (UUID), Name, Industry, Region, Address, PrimaryAccountManagerUserID, PrimaryBU_ID, IsActive
- Relationships:
  - Many-to-One with User (primary account manager)
  - Many-to-One with BusinessUnit (primary business unit)
  - One-to-Many with ClientContact (client contacts)
  - One-to-Many with Engagement (services currently engaged)
  - One-to-Many with Opportunity (cross-sell opportunities)

### Service
Represents services offered by Wondrlab's business units.
- Fields: ServiceID (UUID), Name, Description, AssociatedBU_ID, IsActive
- Relationships:
  - Many-to-One with BusinessUnit (each service belongs to one BU)

### User
Represents users of the system with different roles (Admin, Sales, BU Head, Senior Management).
- Relationships:
  - One-to-Many with BusinessUnit (managed BUs)
  - Many-to-One with BusinessUnit (associated BU)

## Database Configuration
The database configuration uses TypeORM with PostgreSQL:
- Connection parameters configurable via environment variables
- Auto schema creation in development (disabled in production)
- Logging enabled in development (disabled in production)
- Entity definitions loaded from the models directory
- Support for migrations and subscribers

## Alignment with PRD Requirements

### User Roles & Access Levels
The User model supports the roles specified in the PRD:
- System Administrator
- Sales / Account Executive
- Business Unit Head
- Senior Management

### Service Management
The Service model aligns with the PRD requirements:
- Services are associated with specific Business Units
- Services have name, description, and active status

### Client Management
The Client model aligns with the PRD requirements:
- Clients have basic information (name, industry, region)
- Clients are associated with a primary account manager and business unit
- Clients can have multiple contacts, engagements, and opportunities

### Cross-Sell Opportunity Management
The Opportunity model (implementation in progress) will support:
- Linking clients to potential services
- Tracking status of opportunities
- Assigning opportunities to users

## Current Status and Next Steps
The backend implementation is in progress with the core data models defined. Next steps include:
1. Implementing controllers and routes for CRUD operations
2. Adding authentication and authorization
3. Implementing the opportunity matrix view logic
4. Adding task management and notification functionality
5. Developing reporting and analytics features

## Technical Considerations
- Role-based access control will be implemented
- API endpoints will follow RESTful design principles
- The system will use JWT for authentication
- Error handling and validation will be standardized across the application

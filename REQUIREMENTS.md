# Wondrlab Cross-Selling Management System – Comprehensive PRD

## Table of Contents

1. Introduction & Purpose
2. Goals & Objectives
3. User Roles & Access Levels
4. Service Management Module
5. Client Management Module
6. Cross-Sell Opportunity Matrix View
7. Workflows, Task Management & Notifications
8. Reporting & Analytics
9. User Interface & Design Considerations
10. Technical Considerations & Deployment
11. Future Enhancements & Out-of-Scope Items
12. Edge Cases & Use Cases

## 1. Introduction & Purpose

### Context
Wondrlab is a multi-disciplinary organization with multiple Business Units (BUs): examples include Content, Experiential, Production, Digital Media, Performance Marketing, Hector Media, Hector SaaS, OPA, Opportune, DBT-Cymetrix, etc. Each BU offers distinct services, often to the same set of clients. Historically, data on client relationships and sold services were siloed, making it difficult to coordinate cross-selling across BUs.

### Project Goal
Implement an internal web-based platform that centralizes client, service, and opportunity data. This system should let Sales, BU Heads, Admins, and Senior Management collaborate in identifying and pursuing cross-sell opportunities. The system will also provide notifications, task management, and analytics to improve synergy between BUs and increase overall revenue.

## 2. Goals & Objectives

### Centralize Cross-Sell Data
- Single repository listing all client accounts and services across all BUs
- Shared view of existing/purchased services vs. potential cross-sell gaps

### Identify Opportunities
- Use a matrix or tabular interface to highlight services a client might need
- Employ simple suggestion logic (e.g., industry match, BU synergy)

### Streamline Collaboration
- Flag potential cross-sell opportunities, assign them, add notes and tasks
- Keep everyone aligned on status of cross-BU opportunities

### Track Progress & Notify
- Implement workflows with tasks, reminders, and status changes
- Send notifications to relevant roles on new clients/services/opportunities

### Inform Strategy with Reporting
- Summaries of cross-sell outcomes (won, lost)
- Top-performing BUs/services, coverage reports (services/client)

### Ensure Usability & Adoption
- Familiar table/matrix UI, minimal training needed, user-friendly forms

### Plan for Scale & Security
- Role-based access, designed for future expansions and possible restrictions
- Encrypted communications, stable architecture that can handle more clients/services

## 3. User Roles & Access Levels

### System Administrator
- Full create/read/update/delete (CRUD) on all data (clients, services, opportunities)
- Manages user accounts, roles, reference data (BUs, industries), system settings
- Can override or correct data as needed

### Sales / Account Executive
- Frontline owners of client relationships
- Can add and edit clients they manage, create new opportunities, update statuses, assign or reassign opportunities (within their scope)
- Typically can view all data in an open-visibility initial approach

### Business Unit Head (BU Head)
- Oversees a specific BU's services and cross-sell opportunities
- Manages the Service catalog for their BU (add/edit/retire services)
- Monitors cross-sell opps for their BU's services (even if flagged by another BU's sales user)
- May reassign tasks within their BU

### Senior Management
- High-level executives with primarily read-only access to clients, services, opportunities, and analytics
- Monitors overall pipeline, coverage, win rates, etc.
- Future: The system may add more granular permission rules (e.g., see only your BU's data). Initially, all roles see all data for collaboration.

## 4. Service Management Module

Each Business Unit manages a catalog of service offerings. The system tracks these centrally to enable cross-selling.

### 4.1 Service Records

Fields:
- Name (string, unique per BU)
- Description (long text)
- Pricing info (text or numeric)
- BU reference (which BU owns the service)
- Applicable industries (multi-select)
- Ideal client role/title (CMO, CIO, etc.)
- Status (active/inactive)

### 4.2 Functionality
- Add New Service: BU Head or Admin can create a new service entry. Must specify BU, name, status.
- Edit / Delete Service: BU Head or Admin can update or remove a service if it's no longer offered.
- Service List View: Tabular display of all services, filterable by BU or industry.
- Duplicate Warnings: System warns if a service with the same name+BU already exists.
- Inactive Services: Do not appear for new cross-sell creation but remain in historical data.

## 5. Client Management Module

Central database of client organizations. Tracks contact details, which services they already use, open opportunities, etc.

### 5.1 Client Records

Fields:
- Name (string, unique)
- Industry (enum or text)
- Contact info (address, phone, website)
- Account owner (user reference)
- Services currently used (multi-select from Service catalog or derived from won opportunities)
- CRM link (optional URL)
- Additional notes (long text)
- Timestamps for creation/update

### 5.2 Functionality
- Add / Edit Client: Sales or Admin can create a new client. System checks for duplicates.
- Manage Contacts: A client can have multiple contact persons (name, job title, email, phone).
- View Client Profile: Summarizes all data about the client (existing services, open opps, closed opps).
- Linking with CRM: The system only stores the external CRM link (no real integration in v1).
- Notifications: When a new client is added, relevant BU Heads or Admin get notified.

## 6. Cross-Sell Opportunity Matrix View

Centerpiece of the application, showing the intersection of Clients (rows) vs. Services (columns).

### 6.1 Matrix Layout
- One axis = Clients (rows)
- Other axis = Services (columns), possibly grouped by BU
- Each cell:
  - If client already has that service, display a checkmark or "Active."
  - If an opportunity is in progress, display the status (e.g., "In Discussion," "Proposal Sent")
  - If no engagement/opportunity, cell is blank → can flag a new cross-sell
- Frozen headers for client names (left column) and service names (top row).

### 6.2 Interactions
- Create Opportunity: Click blank cell → "New Opportunity" modal (auto-filled client+service).
- View/Edit Opportunity: Click a status cell → open detail view of that opportunity.
- Filtering: By BU, by industry, by status, by assigned user.
- Pagination / Scrolling: If large data sets, consider horizontal scroll or partial loading.

## 7. Workflows, Task Management & Notifications

### 7.1 Opportunities & Sales Pipeline
- An Opportunity links one Client to one Service.
- Fields include status (Identified, In Discussion, Proposal Sent, On Hold, Won, Lost), assigned user, priority (High/Med/Low), etc.
- Lifecycle: Created → status updates (notes, tasks) → final outcome (Won or Lost).
- On "Won," the client's record is updated to reflect they now have that service.

### 7.2 Task Assignment
- Each Opportunity can have multiple tasks (e.g., "Send proposal deck," "Follow up call," etc.).
- Each task has an assigned user, due date, status (Pending, In Progress, Completed).
- Users see a "My Tasks" view listing all tasks assigned to them. Overdue tasks trigger reminders.

### 7.3 Notifications
- New Opportunity: Notifies assigned user and possibly the BU Head of the service's BU.
- Opportunity Status Change: Notifies assigned user or client account owner if relevant.
- Task Overdue: Sends a reminder to the task owner. Possibly escalates to BU Head if still pending.

## 8. Reporting & Analytics

### 8.1 Key Reports
- Opportunity Pipeline
  - Lists all open opportunities by stage (Identified → Won/Lost)
  - Filter by BU, date range, assigned user
- Win/Loss Analysis
  - Number of won vs lost opportunities
  - Win rate by BU or by service
- Coverage / Penetration
  - For each client: how many services they use vs total relevant services
  - Identify clients with low coverage → cross-sell potential
- Service Penetration
  - See how many clients use each service
  - Track how many times a service was "won" in cross-sell
- User Activity
  - Opportunities created, tasks completed, notes added per user
  - Possibly a "leaderboard" or performance measure

### 8.2 Report Formats
- Charts (bar, pie, funnel)
- Tables with sorting, filtering
- Export to CSV/Excel/PDF

### 8.3 Data Reliability
- Encourages consistent updates to keep statuses accurate
- Admin can correct data discrepancies (e.g., "Won" opp but client not flagged as using that service)

## 9. User Interface & Design Considerations

### 9.1 Overall Layout
- Web-based app with a top or sidebar menu: Clients, Services, Matrix, Reports, Admin
- Responsive design for tablets (mobile is future enhancement)

### 9.2 Key Screens
- Client List & Detail
  - List: columns for name, industry, BU, # of open opps
  - Detail: contact info, existing services, open opportunities, etc.
- Service Catalog
  - List: name, BU, status, with "Add Service" for BU Head / Admin
  - Inactive services displayed distinctly
- Matrix
  - Rows = Clients, columns = Services, cells show status or blank
  - Clicking blank → create opportunity modal
  - Clicking status → opportunity detail
  - Filters for BU, status, industry
- Opportunity Detail
  - Client + Service, assigned user, status, priority, tasks, notes
  - "Mark as Won/Lost" button
  - Reassign or add tasks easily
- Notifications & Task List
  - In-app notifications or email for new tasks or status changes
  - "My Tasks" screen showing all tasks assigned to a user

### 9.3 Visual Emphasis & Branding
- Clear color/status codes for matrix cells (e.g., green = active service, orange = in discussion, etc.)
- Familiar icons (pencil for edit, plus sign for add, checkmark for done)
- Keep forms straightforward, validations (required fields), tooltips or help text

### 9.4 Edge-Handling in UI
- Large data sets → filtering or pagination in matrix
- Display warnings if user attempts destructive actions (delete a client, inactivate a service used by open opps)
- Provide user feedback on success/failure (toast messages, pop-up alerts)

## 10. Technical Considerations & Deployment

### 10.1 Architecture & Stack
- Front-End: React/Angular/Vue + RESTful or GraphQL calls
- Back-End: Node.js/Express, Python/Django/Flask, or Java/Spring
- Database: PostgreSQL or MySQL with indexing for performance
- API design: consistent endpoints for CRUD on clients, services, opportunities, tasks

### 10.2 Security & Permissions
- Role-based checks on each API endpoint
- HTTPS for all traffic, user authentication (possibly SSO)
- Audit logging for create/edit/delete on critical data

### 10.3 Performance & Scalability
- Use indexed queries for matrix data (client-service cross references)
- If large volume: partial rendering / pagination
- Potential caching for heavy reports
- Testing for concurrency: handle multiple sales users editing simultaneously

### 10.4 Deployment & Maintenance
- Staging + production environments
- Regular DB backups
- Monitoring (APM, logs)
- Potential containerization (Docker, Kubernetes)

## 11. Future Enhancements & Out-of-Scope Items

- Fine-Grained Access Control (see only your BU's data, etc.)
- Integration with External CRM (Salesforce, HubSpot) for data sync
- Opportunity Value Tracking (estimated revenue, ROI reports)
- Advanced AI Recommendation (ML-based cross-sell suggestions)
- Mobile App or deep responsive design for smartphones
- Calendar & Email Integration
- Proposal Generation or quoting
- File Attachments on opportunities

Out of Scope for v1:
- Native mobile apps
- Direct CRM synchronization (manual URL link only)
- Complex quoting or financial tracking
- Multi-currency or advanced pricing
- Customer-facing portals

## 12. Edge Cases & Use Cases

### 12.1 Edge Cases
- Duplicate Clients
  - Same or similar name. The system must check or prompt a merge if duplicates are discovered.
- Multiple Open Opps for Same Client-Service
  - The system blocks creating a second open opportunity if one already exists.
- Inactive Service
  - Do not allow new opportunities for it. Users can only see historical data.
- Reassignment
  - If a user leaves, Admin bulk reassigns that user's clients and opportunities. No orphaned records.
- Stale Opportunities
  - Overdue tasks or no updates for a defined period → reminders or escalation.
- Client with Zero Services
  - The entire row in matrix is blank → a prime cross-sell target.
- Lost Opportunity
  - If user tries to create a new one for the same client-service, prompt or allow only if the old is closed/lost. Possibly note the attempt for repeated lost opportunities.
- Simultaneous Edits
  - Two users editing the same opportunity. System either allows last-write-wins or warns the second editor.
- Scale
  - If BUs or services drastically increase, matrix can become unwieldy. Filtering or partial load is needed.

### 12.2 Example Use Case Flows
- Use Case 1: Onboarding a New Client
  - Sales user clicks "Add Client" → inputs name, industry, account owner = themselves.
  - Goes to matrix → sees a blank row for that new client.
  - Flags a cross-sell opportunity for "Digital Media Strategy."
  - Updates status over time from "Identified" → "In Discussion" → "Won."
  - System automatically marks the service as active for that client.
- Use Case 2: BU Head Assigning Opportunity
  - BU Head notices large client missing their BU service.
  - Clicks blank cell → selects a sales user to assign. Priority = High.
  - Sales user gets a notification, updates notes, tasks, possibly wins the deal.
- Use Case 3: Duplicate Client Merge
  - Admin sees two near-identical clients.
  - Merges them, transferring opportunities and notes from the duplicate to the correct record.
  - One final row remains in the matrix, ensuring no confusion.
- Use Case 4: Task Overdue & Notification
  - Sales user sets a task "Follow up call" due in 3 days.
  - Misses the deadline. The system sends an overdue reminder email.
  - The user completes it or updates the status in the opportunity detail.
- Use Case 5: Senior Management Reviewing KPIs
  - Senior Management logs into "Reports."
  - Views pipeline funnel: 20 identified, 12 in discussion, 8 proposals, 5 won, 4 lost.
  - Filters by quarter → sees a 40% close rate. Investigates lower performance in a particular BU.

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import dbConfig from './config/database';
import { BusinessUnit } from './models/BusinessUnit';
import { User, UserRole } from './models/User';
import { Service } from './models/Service';
import { Client } from './models/Client';
import { ClientContact } from './models/ClientContact';
import { Engagement, EngagementStatus } from './models/Engagement';
import { Opportunity, OpportunityStatus, OpportunityPriority } from './models/Opportunity';
import { Note, ParentEntityType } from './models/Note';
import { Task, TaskStatus } from './models/Task';

// Initialize TypeORM Data Source
const AppDataSource = new DataSource(dbConfig);

// Seed data function
async function seedDatabase() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Connected to database');

    // Clear existing data (in reverse order of dependencies)
    await AppDataSource.getRepository(Task).clear();
    await AppDataSource.getRepository(Note).clear();
    await AppDataSource.getRepository(Opportunity).clear();
    await AppDataSource.getRepository(Engagement).clear();
    await AppDataSource.getRepository(ClientContact).clear();
    await AppDataSource.getRepository(Client).clear();
    await AppDataSource.getRepository(Service).clear();
    await AppDataSource.getRepository(User).clear();
    await AppDataSource.getRepository(BusinessUnit).clear();

    console.log('Cleared existing data');

    // 1. Create Business Units
    const businessUnits = await AppDataSource.getRepository(BusinessUnit).save([
      {
        Name: 'Content',
        Description: 'Content creation and management services',
        IsActive: true
      },
      {
        Name: 'Experiential Marketing',
        Description: 'Event-based marketing and brand experiences',
        IsActive: true
      },
      {
        Name: 'Video Production',
        Description: 'Video creation and production services',
        IsActive: true
      },
      {
        Name: 'Digital Media',
        Description: 'Digital media planning and buying',
        IsActive: true
      },
      {
        Name: 'Performance Marketing',
        Description: 'ROI-focused digital marketing services',
        IsActive: true
      }
    ]);

    console.log(`Created ${businessUnits.length} business units`);

    // 2. Create Users
    const passwordHash = await bcrypt.hash('password123', 10);
    
    const users = await AppDataSource.getRepository(User).save([
      {
        Name: 'Admin User',
        Email: 'admin@wondrlab.com',
        Role: UserRole.ADMIN,
        PasswordHash: passwordHash,
        IsActive: true
      },
      {
        Name: 'Content Manager',
        Email: 'content.manager@wondrlab.com',
        Role: UserRole.BU_MANAGER,
        AssociatedBU_ID: businessUnits[0].BU_ID,
        PasswordHash: passwordHash,
        IsActive: true
      },
      {
        Name: 'Experiential Manager',
        Email: 'experiential.manager@wondrlab.com',
        Role: UserRole.BU_MANAGER,
        AssociatedBU_ID: businessUnits[1].BU_ID,
        PasswordHash: passwordHash,
        IsActive: true
      },
      {
        Name: 'Sales Executive 1',
        Email: 'sales1@wondrlab.com',
        Role: UserRole.SALES_EXEC,
        AssociatedBU_ID: businessUnits[0].BU_ID,
        PasswordHash: passwordHash,
        IsActive: true
      },
      {
        Name: 'Sales Executive 2',
        Email: 'sales2@wondrlab.com',
        Role: UserRole.SALES_EXEC,
        AssociatedBU_ID: businessUnits[1].BU_ID,
        PasswordHash: passwordHash,
        IsActive: true
      },
      {
        Name: 'Executive',
        Email: 'executive@wondrlab.com',
        Role: UserRole.EXECUTIVE,
        PasswordHash: passwordHash,
        IsActive: true
      }
    ]);

    console.log(`Created ${users.length} users`);

    // Update Business Units with Lead Users
    await AppDataSource.getRepository(BusinessUnit).save([
      {
        BU_ID: businessUnits[0].BU_ID,
        LeadUserID: users[1].UserID
      },
      {
        BU_ID: businessUnits[1].BU_ID,
        LeadUserID: users[2].UserID
      }
    ]);

    console.log('Updated business units with lead users');
    
    // 3. Create Services
    const services = await AppDataSource.getRepository(Service).save([
      {
        Name: 'Content Strategy',
        Description: 'Developing comprehensive content strategies',
        AssociatedBU_ID: businessUnits[0].BU_ID,
        IsActive: true
      },
      {
        Name: 'Content Creation',
        Description: 'Creating engaging content for various platforms',
        AssociatedBU_ID: businessUnits[0].BU_ID,
        IsActive: true
      },
      {
        Name: 'Event Planning',
        Description: 'Planning and organizing brand events',
        AssociatedBU_ID: businessUnits[1].BU_ID,
        IsActive: true
      },
      {
        Name: 'Brand Activations',
        Description: 'Creating memorable brand experiences',
        AssociatedBU_ID: businessUnits[1].BU_ID,
        IsActive: true
      },
      {
        Name: 'Video Production',
        Description: 'Full-service video production',
        AssociatedBU_ID: businessUnits[2].BU_ID,
        IsActive: true
      },
      {
        Name: 'Digital Media Planning',
        Description: 'Strategic digital media planning',
        AssociatedBU_ID: businessUnits[3].BU_ID,
        IsActive: true
      },
      {
        Name: 'Performance Campaigns',
        Description: 'ROI-driven marketing campaigns',
        AssociatedBU_ID: businessUnits[4].BU_ID,
        IsActive: true
      }
    ]);

    console.log(`Created ${services.length} services`);

    // 4. Create Clients
    const clients = await AppDataSource.getRepository(Client).save([
      {
        Name: 'TechCorp',
        Industry: 'Technology',
        Region: 'North',
        PrimaryAccountManagerUserID: users[3].UserID,
        PrimaryBU_ID: businessUnits[0].BU_ID,
        Address: '123 Tech Street, Tech City',
        IsActive: true
      },
      {
        Name: 'Fashion Forward',
        Industry: 'Fashion',
        Region: 'West',
        PrimaryAccountManagerUserID: users[4].UserID,
        PrimaryBU_ID: businessUnits[1].BU_ID,
        Address: '456 Fashion Avenue, Style City',
        IsActive: true
      },
      {
        Name: 'Food Delights',
        Industry: 'Food & Beverage',
        Region: 'South',
        PrimaryAccountManagerUserID: users[3].UserID,
        PrimaryBU_ID: businessUnits[0].BU_ID,
        Address: '789 Taste Road, Flavor Town',
        IsActive: true
      },
      {
        Name: 'Finance Plus',
        Industry: 'Finance',
        Region: 'East',
        PrimaryAccountManagerUserID: users[4].UserID,
        PrimaryBU_ID: businessUnits[1].BU_ID,
        Address: '101 Money Lane, Wealth City',
        IsActive: true
      }
    ]);

    console.log(`Created ${clients.length} clients`);

    // 5. Create Client Contacts
    const clientContacts = await AppDataSource.getRepository(ClientContact).save([
      {
        ClientID: clients[0].ClientID,
        Name: 'John Tech',
        Email: 'john@techcorp.com',
        Phone: '123-456-7890',
        RoleTitle: 'Marketing Director',
        IsPrimary: true
      },
      {
        ClientID: clients[0].ClientID,
        Name: 'Sarah Tech',
        Email: 'sarah@techcorp.com',
        Phone: '123-456-7891',
        RoleTitle: 'Brand Manager',
        IsPrimary: false
      },
      {
        ClientID: clients[1].ClientID,
        Name: 'Emma Fashion',
        Email: 'emma@fashionforward.com',
        Phone: '234-567-8901',
        RoleTitle: 'Creative Director',
        IsPrimary: true
      },
      {
        ClientID: clients[2].ClientID,
        Name: 'Mike Food',
        Email: 'mike@fooddelights.com',
        Phone: '345-678-9012',
        RoleTitle: 'CEO',
        IsPrimary: true
      },
      {
        ClientID: clients[3].ClientID,
        Name: 'Lisa Finance',
        Email: 'lisa@financeplus.com',
        Phone: '456-789-0123',
        RoleTitle: 'Marketing Manager',
        IsPrimary: true
      }
    ]);

    console.log(`Created ${clientContacts.length} client contacts`);
    
    // 6. Create Engagements
    const engagements = await AppDataSource.getRepository(Engagement).save([
      {
        ClientID: clients[0].ClientID,
        ServiceID: services[0].ServiceID,
        StartDate: new Date('2023-01-15'),
        Status: EngagementStatus.ACTIVE,
        Notes: 'Ongoing content strategy services'
      },
      {
        ClientID: clients[1].ClientID,
        ServiceID: services[3].ServiceID,
        StartDate: new Date('2023-02-20'),
        Status: EngagementStatus.ACTIVE,
        Notes: 'Regular brand activation services'
      },
      {
        ClientID: clients[2].ClientID,
        ServiceID: services[1].ServiceID,
        StartDate: new Date('2023-03-10'),
        Status: EngagementStatus.ACTIVE,
        Notes: 'Content creation for social media'
      },
      {
        ClientID: clients[3].ClientID,
        ServiceID: services[2].ServiceID,
        StartDate: new Date('2023-01-05'),
        EndDate: new Date('2023-06-05'),
        Status: EngagementStatus.ENDED,
        Notes: 'Annual event planning and execution'
      }
    ]);

    console.log(`Created ${engagements.length} engagements`);

    // 7. Create Opportunities
    const opportunities = await AppDataSource.getRepository(Opportunity).save([
      {
        ClientID: clients[0].ClientID,
        ServiceID: services[4].ServiceID,
        Status: OpportunityStatus.IN_DISCUSSION,
        AssignedToUserID: users[3].UserID,
        CreatedByUserID: users[1].UserID,
        ExpectedCloseDate: new Date('2023-08-30'),
        EstimatedValue: 15000,
        Priority: OpportunityPriority.HIGH,
        DescriptionNotes: 'Potential video production project for product launch'
      },
      {
        ClientID: clients[0].ClientID,
        ServiceID: services[6].ServiceID,
        Status: OpportunityStatus.PROPOSAL_SENT,
        AssignedToUserID: users[4].UserID,
        CreatedByUserID: users[2].UserID,
        ExpectedCloseDate: new Date('2023-09-15'),
        EstimatedValue: 25000,
        Priority: OpportunityPriority.MEDIUM,
        DescriptionNotes: 'Performance marketing campaign for Q4'
      },
      {
        ClientID: clients[1].ClientID,
        ServiceID: services[0].ServiceID,
        Status: OpportunityStatus.IDENTIFIED,
        AssignedToUserID: users[3].UserID,
        CreatedByUserID: users[3].UserID,
        ExpectedCloseDate: new Date('2023-10-01'),
        EstimatedValue: 10000,
        Priority: OpportunityPriority.LOW,
        DescriptionNotes: 'Content strategy for new product line'
      },
      {
        ClientID: clients[2].ClientID,
        ServiceID: services[3].ServiceID,
        Status: OpportunityStatus.WON,
        AssignedToUserID: users[4].UserID,
        CreatedByUserID: users[2].UserID,
        ExpectedCloseDate: new Date('2023-07-15'),
        EstimatedValue: 30000,
        Priority: OpportunityPriority.HIGH,
        DescriptionNotes: 'Brand activation for summer campaign'
      },
      {
        ClientID: clients[3].ClientID,
        ServiceID: services[5].ServiceID,
        Status: OpportunityStatus.LOST,
        AssignedToUserID: users[3].UserID,
        CreatedByUserID: users[1].UserID,
        ExpectedCloseDate: new Date('2023-06-30'),
        EstimatedValue: 20000,
        Priority: OpportunityPriority.MEDIUM,
        DescriptionNotes: 'Digital media planning for Q3'
      }
    ]);

    console.log(`Created ${opportunities.length} opportunities`);
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    // Close the connection
    await AppDataSource.destroy();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedDatabase();
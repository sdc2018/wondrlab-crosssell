import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BusinessUnit } from './BusinessUnit';
import { Client } from './Client';
import { Opportunity } from './Opportunity';
import { Note } from './Note';
import { Task } from './Task';

// Enum for user roles
export enum UserRole {
  ADMIN = 'Admin',
  SALES_EXEC = 'SalesExec',
  BU_MANAGER = 'BUManager',
  EXECUTIVE = 'Executive'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  UserID: string;

  @Column({ length: 100, nullable: false })
  Name: string;

  @Column({ length: 100, nullable: false, unique: true })
  Email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SALES_EXEC
  })
  Role: UserRole;

  @Column({ nullable: true })
  AssociatedBU_ID: string;

  @Column({ nullable: true })
  PasswordHash: string;

  @Column({ default: true })
  IsActive: boolean;

  // Relationships
  @ManyToOne(() => BusinessUnit, businessUnit => businessUnit.Users, { nullable: true })
  @JoinColumn({ name: 'AssociatedBU_ID' })
  AssociatedBusinessUnit: BusinessUnit;

  @OneToMany(() => BusinessUnit, businessUnit => businessUnit.LeadUser)
  ManagedBusinessUnits: BusinessUnit[];

  @OneToMany(() => Client, client => client.PrimaryAccountManager)
  ManagedClients: Client[];

  @OneToMany(() => Opportunity, opportunity => opportunity.AssignedTo)
  AssignedOpportunities: Opportunity[];

  @OneToMany(() => Opportunity, opportunity => opportunity.CreatedBy)
  CreatedOpportunities: Opportunity[];

  @OneToMany(() => Note, note => note.Author)
  AuthoredNotes: Note[];

  @OneToMany(() => Task, task => task.AssignedUser)
  AssignedTasks: Task[];
}
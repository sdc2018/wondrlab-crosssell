import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Client } from './Client';
import { Service } from './Service';
import { User } from './User';
import { Task } from './Task';
import { Note } from './Note';

// Enum for opportunity status
export enum OpportunityStatus {
  IDENTIFIED = 'Identified',
  IN_DISCUSSION = 'In Discussion',
  PROPOSAL_SENT = 'Proposal Sent',
  ON_HOLD = 'On Hold',
  WON = 'Won',
  LOST = 'Lost',
  CANCELLED = 'Cancelled/Not Pursued'
}

// Enum for opportunity priority
export enum OpportunityPriority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

@Entity('opportunities')
export class Opportunity {
  @PrimaryGeneratedColumn('uuid')
  OpportunityID: string;

  @Column({ nullable: false })
  ClientID: string;

  @Column({ nullable: false })
  ServiceID: string;

  @Column({
    type: 'enum',
    enum: OpportunityStatus,
    default: OpportunityStatus.IDENTIFIED
  })
  Status: OpportunityStatus;

  @Column({ nullable: false })
  AssignedToUserID: string;

  @Column({ nullable: false })
  CreatedByUserID: string;

  @CreateDateColumn()
  CreatedDate: Date;

  @UpdateDateColumn()
  LastUpdatedDate: Date;

  @Column({ type: 'date', nullable: true })
  ExpectedCloseDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  EstimatedValue: number;

  @Column({
    type: 'enum',
    enum: OpportunityPriority,
    default: OpportunityPriority.MEDIUM
  })
  Priority: OpportunityPriority;

  @Column({ type: 'text', nullable: true })
  DescriptionNotes: string;

  // Relationships
  @ManyToOne(() => Client, client => client.Opportunities, { nullable: false })
  @JoinColumn({ name: 'ClientID' })
  Client: Client;

  @ManyToOne(() => Service, { nullable: false })
  @JoinColumn({ name: 'ServiceID' })
  Service: Service;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'AssignedToUserID' })
  AssignedTo: User;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'CreatedByUserID' })
  CreatedBy: User;

  @OneToMany(() => Task, task => task.Opportunity)
  Tasks: Task[];

  // Notes relationship will be handled in the service layer
  // since we need to filter by ParentEntityType
}
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Opportunity } from './Opportunity';
import { User } from './User';

// Enum for task status
export enum TaskStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  TaskID: string;

  @Column({ nullable: false })
  OpportunityID: string;

  @Column({ type: 'text', nullable: false })
  Description: string;

  @Column({ type: 'date', nullable: true })
  DueDate: Date;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING
  })
  Status: TaskStatus;

  @Column({ nullable: false })
  AssignedUserID: string;

  @CreateDateColumn()
  DateCreated: Date;

  @Column({ type: 'date', nullable: true })
  DateCompleted: Date;

  // Relationships
  @ManyToOne(() => Opportunity, { nullable: false })
  @JoinColumn({ name: 'OpportunityID' })
  Opportunity: Opportunity;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'AssignedUserID' })
  AssignedUser: User;
}

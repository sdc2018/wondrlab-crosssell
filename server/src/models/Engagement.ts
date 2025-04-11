import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from './Client';
import { Service } from './Service';

// Enum for engagement status
export enum EngagementStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ENDED = 'Ended'
}

@Entity('engagements')
export class Engagement {
  @PrimaryGeneratedColumn('uuid')
  EngagementID: string;

  @Column({ nullable: false })
  ClientID: string;

  @Column({ nullable: false })
  ServiceID: string;

  @Column({ type: 'date', nullable: false })
  StartDate: Date;

  @Column({ type: 'date', nullable: true })
  EndDate: Date;

  @Column({
    type: 'enum',
    enum: EngagementStatus,
    default: EngagementStatus.ACTIVE
  })
  Status: EngagementStatus;

  @Column({ type: 'text', nullable: true })
  Notes: string;

  // Relationships
  @ManyToOne(() => Client, { nullable: false })
  @JoinColumn({ name: 'ClientID' })
  Client: Client;

  @ManyToOne(() => Service, { nullable: false })
  @JoinColumn({ name: 'ServiceID' })
  Service: Service;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BusinessUnit } from './BusinessUnit';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  ServiceID: string;

  @Column({ length: 100, nullable: false })
  Name: string;

  @Column({ type: 'text', nullable: true })
  Description: string;

  @Column({ nullable: false })
  AssociatedBU_ID: string;

  @Column({ default: true })
  IsActive: boolean;

  // Relationships
  @ManyToOne(() => BusinessUnit, businessUnit => businessUnit.Services, { nullable: false })
  @JoinColumn({ name: 'AssociatedBU_ID' })
  BusinessUnit: BusinessUnit;

  // Note: Relationships to Clients via Engagements and Opportunities
  // will be defined when those entity models are created
}

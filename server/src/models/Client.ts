import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { BusinessUnit } from './BusinessUnit';
import { ClientContact } from './ClientContact';
import { Engagement } from './Engagement';
import { Opportunity } from './Opportunity';
import { Note } from './Note';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  ClientID: string;

  @Column({ length: 100, nullable: false })
  Name: string;

  @Column({ length: 100, nullable: true })
  Industry: string;

  @Column({ length: 50, nullable: true })
  Region: string;

  @Column({ nullable: true })
  PrimaryAccountManagerUserID: string;

  @Column({ nullable: true })
  PrimaryBU_ID: string;

  @Column({ type: 'text', nullable: true })
  Address: string;

  @Column({ default: true })
  IsActive: boolean;

  // Relationships
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'PrimaryAccountManagerUserID' })
  PrimaryAccountManager: User;

  @ManyToOne(() => BusinessUnit, { nullable: true })
  @JoinColumn({ name: 'PrimaryBU_ID' })
  PrimaryBusinessUnit: BusinessUnit;

  @OneToMany(() => ClientContact, clientContact => clientContact.Client)
  Contacts: ClientContact[];

  @OneToMany(() => Engagement, engagement => engagement.Client)
  Engagements: Engagement[];

  @OneToMany(() => Opportunity, opportunity => opportunity.Client)
  Opportunities: Opportunity[];

  // Notes relationship will be handled in the service layer
  // since we need to filter by ParentEntityType
}
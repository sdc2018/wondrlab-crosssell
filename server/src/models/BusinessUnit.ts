import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Service } from './Service';
import { User } from './User';

@Entity('business_units')
export class BusinessUnit {
  @PrimaryGeneratedColumn('uuid')
  BU_ID: string;

  @Column({ length: 100, nullable: false })
  Name: string;

  @Column({ type: 'text', nullable: true })
  Description: string;

  @Column({ nullable: true })
  LeadUserID: string;

  @Column({ default: true })
  IsActive: boolean;

  // Relationships
  @ManyToOne(() => User, user => user.ManagedBusinessUnits, { nullable: true })
  @JoinColumn({ name: 'LeadUserID' })
  LeadUser: User;

  @OneToMany(() => Service, service => service.BusinessUnit)
  Services: Service[];

  @OneToMany(() => User, user => user.AssociatedBusinessUnit)
  Users: User[];
}

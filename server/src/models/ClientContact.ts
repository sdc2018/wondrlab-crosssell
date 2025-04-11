import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from './Client';

@Entity('client_contacts')
export class ClientContact {
  @PrimaryGeneratedColumn('uuid')
  ContactID: string;

  @Column({ nullable: false })
  ClientID: string;

  @Column({ length: 100, nullable: false })
  Name: string;

  @Column({ length: 100, nullable: true })
  Email: string;

  @Column({ length: 50, nullable: true })
  Phone: string;

  @Column({ length: 100, nullable: true })
  RoleTitle: string;

  @Column({ default: false })
  IsPrimary: boolean;

  // Relationships
  @ManyToOne(() => Client, { nullable: false })
  @JoinColumn({ name: 'ClientID' })
  Client: Client;
}

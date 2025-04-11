import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Opportunity } from './Opportunity';
import { Client } from './Client';

// Enum for parent entity type
export enum ParentEntityType {
  OPPORTUNITY = 'Opportunity',
  CLIENT = 'Client'
}

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn('uuid')
  NoteID: string;

  @Column({
    type: 'enum',
    enum: ParentEntityType,
    nullable: false
  })
  ParentEntityType: ParentEntityType;

  @Column({ nullable: false })
  ParentEntityID: string;

  @Column({ nullable: false })
  AuthorUserID: string;

  @CreateDateColumn()
  Timestamp: Date;

  @Column({ type: 'text', nullable: false })
  Content: string;

  // Relationships
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'AuthorUserID' })
  Author: User;

  // Note: We're using a discriminator pattern here since a Note can belong
  // to either an Opportunity or a Client. The actual relationship is determined
  // at runtime based on the ParentEntityType.
}

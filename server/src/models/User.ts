import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { BusinessUnit } from './BusinessUnit';
import * as bcrypt from 'bcrypt';

/**
 * User roles for role-based access control
 */
export enum UserRole {
  ADMIN = 'admin',
  SALES = 'sales',
  BU_HEAD = 'bu_head',
  MANAGEMENT = 'management'
}

/**
 * User entity for authentication and authorization
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  username: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SALES
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLogin: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationship with BusinessUnit - User belongs to a business unit
  @ManyToOne(() => BusinessUnit, businessUnit => businessUnit.users)
  businessUnit: BusinessUnit;

  @Column({ nullable: true })
  businessUnitId: string;

  // For BU_HEAD role - User can be head of multiple business units
  @OneToMany(() => BusinessUnit, businessUnit => businessUnit.leadUser)
  managedBusinessUnits: BusinessUnit[];

  /**
   * Hash password before inserting or updating
   */
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Only hash the password if it has been modified
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        throw new Error('Error hashing password');
      }
    }
  }

  /**
   * Check if provided password matches stored hash
   * @param password Plain text password to check
   * @returns Promise resolving to boolean indicating if password matches
   */
  async checkPassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw new Error('Error comparing passwords');
    }
  }

  /**
   * Get full name of user
   * @returns Full name (first name + last name)
   */
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Check if user has a specific role
   * @param role Role to check
   * @returns Boolean indicating if user has the role
   */
  hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  /**
   * Check if user is an administrator
   * @returns Boolean indicating if user is an admin
   */
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  /**
   * Check if user is a business unit head
   * @returns Boolean indicating if user is a BU head
   */
  isBusinessUnitHead(): boolean {
    return this.role === UserRole.BU_HEAD;
  }

  /**
   * Convert user to JSON representation (excluding sensitive data)
   * @returns User object without password
   */
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
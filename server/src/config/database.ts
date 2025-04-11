import { DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration
const dbConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'wondrlab_crosssell',
  synchronize: process.env.NODE_ENV !== 'production', // Auto-create database schema in development
  logging: process.env.NODE_ENV !== 'production',
  entities: [
    'src/models/**/*.ts'
  ],
  migrations: [
    'src/migrations/**/*.ts'
  ],
  subscribers: [
    'src/subscribers/**/*.ts'
  ]
};

export default dbConfig;
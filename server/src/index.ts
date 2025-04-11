import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import dbConfig from './config/database.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Express = express();
const port = process.env.PORT || 3001;

// Initialize TypeORM Data Source
const AppDataSource = new DataSource(dbConfig);

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Basic route for testing
app.get('/', (_req: Request, res: Response) => {
  res.send('Wondrlab Cross-Sell Opportunity Management API');
});

// Start server and connect to database
const startServer = async () => {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Connected to database');

    // Start Express server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
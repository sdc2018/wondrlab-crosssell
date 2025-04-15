import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

// Setup before all tests
beforeAll(async () => {
  // Create an in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  // Connect to the in-memory database
  await mongoose.connect(uri);
});

// Clean up after each test
afterEach(async () => {
  // Clear all collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Clean up after all tests
afterAll(async () => {
  // Disconnect from the database
  await mongoose.disconnect();
  // Stop the in-memory server
  await mongoServer.stop();
});

// Global test timeout
jest.setTimeout(30000);

// Mock console.error to keep test output clean
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  // Filter out specific expected errors during tests
  if (
    args[0]?.includes?.('Warning:') ||
    args[0]?.includes?.('Error:') ||
    args[0]?.includes?.('Invalid hook call')
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Reset mocks automatically
jest.clearAllMocks();

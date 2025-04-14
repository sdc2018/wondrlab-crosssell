import { getRepository, Repository } from 'typeorm';
import { Client } from '../models/Client';

/**
 * Service class for handling Client-related business logic
 */
export class ClientService {
  private clientRepository: Repository<Client>;

  constructor() {
    this.clientRepository = getRepository(Client);
  }

  /**
   * Get all clients with optional filtering
   * @param filters Optional filters for industry and status
   * @returns Promise resolving to an array of clients
   */
  public async findAll(filters?: { industry?: string; status?: string }): Promise<Client[]> {
    try {
      let query = this.clientRepository.createQueryBuilder('client');
      
      // Apply filters if provided
      if (filters) {
        if (filters.industry) {
          query = query.andWhere('client.industry = :industry', { industry: filters.industry });
        }
        
        if (filters.status) {
          query = query.andWhere('client.status = :status', { status: filters.status });
        }
      }
      
      return await query.getMany();
    } catch (error) {
      console.error('Error in ClientService.findAll:', error);
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }
  }

  /**
   * Get a client by ID with optional relations
   * @param id Client ID
   * @param relations Optional relations to include
   * @returns Promise resolving to a client or null if not found
   */
  public async findById(id: string, relations: string[] = []): Promise<Client | null> {
    try {
      return await this.clientRepository.findOne({
        where: { id },
        relations
      });
    } catch (error) {
      console.error(`Error in ClientService.findById for ID ${id}:`, error);
      throw new Error(`Failed to fetch client with ID ${id}: ${error.message}`);
    }
  }

  /**
   * Create a new client
   * @param clientData Client data
   * @returns Promise resolving to the created client
   */
  public async create(clientData: Partial<Client>): Promise<Client> {
    try {
      // Validate required fields
      if (!clientData.name) {
        throw new Error('Client name is required');
      }
      
      const newClient = this.clientRepository.create(clientData);
      return await this.clientRepository.save(newClient);
    } catch (error) {
      console.error('Error in ClientService.create:', error);
      throw new Error(`Failed to create client: ${error.message}`);
    }
  }

  /**
   * Update an existing client
   * @param id Client ID
   * @param clientData Updated client data
   * @returns Promise resolving to the updated client
   */
  public async update(id: string, clientData: Partial<Client>): Promise<Client> {
    try {
      // Find client by ID
      const client = await this.findById(id);
      
      if (!client) {
        throw new Error(`Client with ID ${id} not found`);
      }
      
      // Update client
      this.clientRepository.merge(client, clientData);
      return await this.clientRepository.save(client);
    } catch (error) {
      console.error(`Error in ClientService.update for ID ${id}:`, error);
      throw new Error(`Failed to update client with ID ${id}: ${error.message}`);
    }
  }

  /**
   * Delete a client
   * @param id Client ID
   * @returns Promise resolving to boolean indicating success
   */
  public async delete(id: string): Promise<boolean> {
    try {
      // Find client by ID
      const client = await this.findById(id);
      
      if (!client) {
        throw new Error(`Client with ID ${id} not found`);
      }
      
      // Delete client
      await this.clientRepository.remove(client);
      return true;
    } catch (error) {
      console.error(`Error in ClientService.delete for ID ${id}:`, error);
      throw new Error(`Failed to delete client with ID ${id}: ${error.message}`);
    }
  }

  /**
   * Check if a client exists by name
   * @param name Client name
   * @returns Promise resolving to boolean indicating if client exists
   */
  public async existsByName(name: string): Promise<boolean> {
    try {
      const count = await this.clientRepository.count({ where: { name } });
      return count > 0;
    } catch (error) {
      console.error(`Error in ClientService.existsByName for name ${name}:`, error);
      throw new Error(`Failed to check if client with name ${name} exists: ${error.message}`);
    }
  }

  /**
   * Get clients by industry
   * @param industry Industry name
   * @returns Promise resolving to an array of clients
   */
  public async findByIndustry(industry: string): Promise<Client[]> {
    try {
      return await this.clientRepository.find({ where: { industry } });
    } catch (error) {
      console.error(`Error in ClientService.findByIndustry for industry ${industry}:`, error);
      throw new Error(`Failed to fetch clients in industry ${industry}: ${error.message}`);
    }
  }

  /**
   * Get active clients
   * @returns Promise resolving to an array of active clients
   */
  public async findActiveClients(): Promise<Client[]> {
    try {
      return await this.clientRepository.find({ where: { status: 'active' } });
    } catch (error) {
      console.error('Error in ClientService.findActiveClients:', error);
      throw new Error(`Failed to fetch active clients: ${error.message}`);
    }
  }
}

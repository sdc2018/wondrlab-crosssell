import { getRepository, Repository } from 'typeorm';
import { Opportunity } from '../models/Opportunity';
import { Client } from '../models/Client';
import { BusinessUnit } from '../models/BusinessUnit';
import { Service } from '../models/Service';

/**
 * Service class for handling Opportunity-related business logic
 */
export class OpportunityService {
  private opportunityRepository: Repository<Opportunity>;
  private clientRepository: Repository<Client>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private serviceRepository: Repository<Service>;

  constructor() {
    this.opportunityRepository = getRepository(Opportunity);
    this.clientRepository = getRepository(Client);
    this.businessUnitRepository = getRepository(BusinessUnit);
    this.serviceRepository = getRepository(Service);
  }

  /**
   * Get all opportunities with optional filtering
   * @param filters Optional filters for status, client, business unit, etc.
   * @returns Promise resolving to an array of opportunities
   */
  public async findAll(filters?: {
    status?: string;
    clientId?: string;
    businessUnitId?: string;
    serviceId?: string;
  }): Promise<Opportunity[]> {
    try {
      let query = this.opportunityRepository.createQueryBuilder('opportunity')
        .leftJoinAndSelect('opportunity.client', 'client')
        .leftJoinAndSelect('opportunity.businessUnit', 'businessUnit')
        .leftJoinAndSelect('opportunity.service', 'service')
        .leftJoinAndSelect('opportunity.tasks', 'tasks');
      
      // Apply filters if provided
      if (filters) {
        if (filters.status) {
          query = query.andWhere('opportunity.status = :status', { status: filters.status });
        }
        
        if (filters.clientId) {
          query = query.andWhere('client.id = :clientId', { clientId: filters.clientId });
        }
        
        if (filters.businessUnitId) {
          query = query.andWhere('businessUnit.id = :businessUnitId', { businessUnitId: filters.businessUnitId });
        }
        
        if (filters.serviceId) {
          query = query.andWhere('service.id = :serviceId', { serviceId: filters.serviceId });
        }
      }
      
      return await query.getMany();
    } catch (error) {
      console.error('Error in OpportunityService.findAll:', error);
      throw new Error(`Failed to fetch opportunities: ${error.message}`);
    }
  }

  /**
   * Get an opportunity by ID
   * @param id Opportunity ID
   * @returns Promise resolving to an opportunity or null if not found
   */
  public async findById(id: string): Promise<Opportunity | null> {
    try {
      return await this.opportunityRepository.findOne({
        where: { id },
        relations: ['client', 'businessUnit', 'service', 'tasks', 'notes']
      });
    } catch (error) {
      console.error(`Error in OpportunityService.findById for ID ${id}:`, error);
      throw new Error(`Failed to fetch opportunity with ID ${id}: ${error.message}`);
    }
  }

  /**
   * Create a new opportunity
   * @param opportunityData Opportunity data
   * @returns Promise resolving to the created opportunity
   */
  public async create(opportunityData: Partial<Opportunity>): Promise<Opportunity> {
    try {
      // Validate required fields
      if (!opportunityData.title) {
        throw new Error('Opportunity title is required');
      }
      
      if (!opportunityData.clientId) {
        throw new Error('Client ID is required');
      }
      
      if (!opportunityData.businessUnitId) {
        throw new Error('Business Unit ID is required');
      }
      
      if (!opportunityData.serviceId) {
        throw new Error('Service ID is required');
      }
      
      // Verify client exists
      const client = await this.clientRepository.findOne({ where: { id: opportunityData.clientId } });
      if (!client) {
        throw new Error(`Client with ID ${opportunityData.clientId} not found`);
      }
      
      // Verify business unit exists
      const businessUnit = await this.businessUnitRepository.findOne({ where: { id: opportunityData.businessUnitId } });
      if (!businessUnit) {
        throw new Error(`Business Unit with ID ${opportunityData.businessUnitId} not found`);
      }
      
      // Verify service exists
      const service = await this.serviceRepository.findOne({ where: { id: opportunityData.serviceId } });
      if (!service) {
        throw new Error(`Service with ID ${opportunityData.serviceId} not found`);
      }
      
      // Set default values if not provided
      if (!opportunityData.status) {
        opportunityData.status = 'new';
      }
      
      if (!opportunityData.probability) {
        opportunityData.probability = 0;
      }
      
      if (!opportunityData.value) {
        opportunityData.value = 0;
      }
      
      // Create and save opportunity
      const newOpportunity = this.opportunityRepository.create(opportunityData);
      return await this.opportunityRepository.save(newOpportunity);
    } catch (error) {
      console.error('Error in OpportunityService.create:', error);
      throw new Error(`Failed to create opportunity: ${error.message}`);
    }
  }

  /**
   * Update an existing opportunity
   * @param id Opportunity ID
   * @param opportunityData Updated opportunity data
   * @returns Promise resolving to the updated opportunity
   */
  public async update(id: string, opportunityData: Partial<Opportunity>): Promise<Opportunity> {
    try {
      // Find opportunity by ID
      const opportunity = await this.findById(id);
      
      if (!opportunity) {
        throw new Error(`Opportunity with ID ${id} not found`);
      }
      
      // Verify client exists if clientId is provided
      if (opportunityData.clientId) {
        const client = await this.clientRepository.findOne({ where: { id: opportunityData.clientId } });
        if (!client) {
          throw new Error(`Client with ID ${opportunityData.clientId} not found`);
        }
      }
      
      // Verify business unit exists if businessUnitId is provided
      if (opportunityData.businessUnitId) {
        const businessUnit = await this.businessUnitRepository.findOne({ where: { id: opportunityData.businessUnitId } });
        if (!businessUnit) {
          throw new Error(`Business Unit with ID ${opportunityData.businessUnitId} not found`);
        }
      }
      
      // Verify service exists if serviceId is provided
      if (opportunityData.serviceId) {
        const service = await this.serviceRepository.findOne({ where: { id: opportunityData.serviceId } });
        if (!service) {
          throw new Error(`Service with ID ${opportunityData.serviceId} not found`);
        }
      }
      
      // Update opportunity
      this.opportunityRepository.merge(opportunity, opportunityData);
      return await this.opportunityRepository.save(opportunity);
    } catch (error) {
      console.error(`Error in OpportunityService.update for ID ${id}:`, error);
      throw new Error(`Failed to update opportunity with ID ${id}: ${error.message}`);
    }
  }

  /**
   * Delete an opportunity
   * @param id Opportunity ID
   * @returns Promise resolving to boolean indicating success
   */
  public async delete(id: string): Promise<boolean> {
    try {
      // Find opportunity by ID
      const opportunity = await this.findById(id);
      
      if (!opportunity) {
        throw new Error(`Opportunity with ID ${id} not found`);
      }
      
      // Delete opportunity
      await this.opportunityRepository.remove(opportunity);
      return true;
    } catch (error) {
      console.error(`Error in OpportunityService.delete for ID ${id}:`, error);
      throw new Error(`Failed to delete opportunity with ID ${id}: ${error.message}`);
    }
  }

  /**
   * Update opportunity status
   * @param id Opportunity ID
   * @param status New status
   * @returns Promise resolving to the updated opportunity
   */
  public async updateStatus(id: string, status: string): Promise<Opportunity> {
    try {
      // Validate status
      const validStatuses = ['new', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
      }
      
      return await this.update(id, { status });
    } catch (error) {
      console.error(`Error in OpportunityService.updateStatus for ID ${id}:`, error);
      throw new Error(`Failed to update status for opportunity with ID ${id}: ${error.message}`);
    }
  }

  /**
   * Get opportunities by client
   * @param clientId Client ID
   * @returns Promise resolving to an array of opportunities
   */
  public async findByClient(clientId: string): Promise<Opportunity[]> {
    try {
      return await this.findAll({ clientId });
    } catch (error) {
      console.error(`Error in OpportunityService.findByClient for client ID ${clientId}:`, error);
      throw new Error(`Failed to fetch opportunities for client with ID ${clientId}: ${error.message}`);
    }
  }

  /**
   * Get opportunities by business unit
   * @param businessUnitId Business Unit ID
   * @returns Promise resolving to an array of opportunities
   */
  public async findByBusinessUnit(businessUnitId: string): Promise<Opportunity[]> {
    try {
      return await this.findAll({ businessUnitId });
    } catch (error) {
      console.error(`Error in OpportunityService.findByBusinessUnit for business unit ID ${businessUnitId}:`, error);
      throw new Error(`Failed to fetch opportunities for business unit with ID ${businessUnitId}: ${error.message}`);
    }
  }

  /**
   * Get opportunities by service
   * @param serviceId Service ID
   * @returns Promise resolving to an array of opportunities
   */
  public async findByService(serviceId: string): Promise<Opportunity[]> {
    try {
      return await this.findAll({ serviceId });
    } catch (error) {
      console.error(`Error in OpportunityService.findByService for service ID ${serviceId}:`, error);
      throw new Error(`Failed to fetch opportunities for service with ID ${serviceId}: ${error.message}`);
    }
  }

  /**
   * Get opportunities by status
   * @param status Status
   * @returns Promise resolving to an array of opportunities
   */
  public async findByStatus(status: string): Promise<Opportunity[]> {
    try {
      return await this.findAll({ status });
    } catch (error) {
      console.error(`Error in OpportunityService.findByStatus for status ${status}:`, error);
      throw new Error(`Failed to fetch opportunities with status ${status}: ${error.message}`);
    }
  }
}

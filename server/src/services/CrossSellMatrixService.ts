import { getRepository, Repository } from 'typeorm';
import { Client } from '../models/Client';
import { BusinessUnit } from '../models/BusinessUnit';
import { Service } from '../models/Service';
import { Opportunity } from '../models/Opportunity';

/**
 * Interface for cross-sell matrix item
 */
interface CrossSellMatrixItem {
  clientId: string;
  clientName: string;
  clientIndustry: string;
  clientRegion: string;
  currentBusinessUnitId: string;
  currentBusinessUnitName: string;
  targetBusinessUnitId: string;
  targetBusinessUnitName: string;
  potentialServices: any[];
  existingServices: any[];
  opportunityScore: number;
  lastEngagementDate?: Date;
}

/**
 * Interface for cross-sell matrix filters
 */
interface CrossSellMatrixFilters {
  clientId?: string;
  clientIndustry?: string;
  clientRegion?: string;
  currentBusinessUnitId?: string;
  targetBusinessUnitId?: string;
  minOpportunityScore?: number;
}

/**
 * Service class for handling Cross-Sell Matrix related business logic
 */
export class CrossSellMatrixService {
  private clientRepository: Repository<Client>;
  private businessUnitRepository: Repository<BusinessUnit>;
  private serviceRepository: Repository<Service>;
  private opportunityRepository: Repository<Opportunity>;

  constructor() {
    this.clientRepository = getRepository(Client);
    this.businessUnitRepository = getRepository(BusinessUnit);
    this.serviceRepository = getRepository(Service);
    this.opportunityRepository = getRepository(Opportunity);
  }

  /**
   * Generate cross-sell matrix data with optional filtering
   * @param filters Optional filters for the matrix data
   * @returns Promise resolving to an array of cross-sell matrix items
   */
  public async generateMatrix(filters?: CrossSellMatrixFilters): Promise<CrossSellMatrixItem[]> {
    try {
      // Get all active clients
      let clientsQuery = this.clientRepository.createQueryBuilder('client')
        .leftJoinAndSelect('client.businessUnit', 'currentBusinessUnit')
        .where('client.isActive = :isActive', { isActive: true });
      
      // Apply client filters if provided
      if (filters) {
        if (filters.clientId) {
          clientsQuery = clientsQuery.andWhere('client.id = :clientId', { clientId: filters.clientId });
        }
        
        if (filters.clientIndustry) {
          clientsQuery = clientsQuery.andWhere('client.industry = :clientIndustry', { clientIndustry: filters.clientIndustry });
        }
        
        if (filters.clientRegion) {
          clientsQuery = clientsQuery.andWhere('client.region = :clientRegion', { clientRegion: filters.clientRegion });
        }
        
        if (filters.currentBusinessUnitId) {
          clientsQuery = clientsQuery.andWhere('currentBusinessUnit.id = :currentBusinessUnitId', { currentBusinessUnitId: filters.currentBusinessUnitId });
        }
      }
      
      const clients = await clientsQuery.getMany();
      
      // Get all active business units
      let businessUnitsQuery = this.businessUnitRepository.createQueryBuilder('businessUnit')
        .where('businessUnit.isActive = :isActive', { isActive: true });
      
      // Apply business unit filter if provided
      if (filters && filters.targetBusinessUnitId) {
        businessUnitsQuery = businessUnitsQuery.andWhere('businessUnit.id = :targetBusinessUnitId', { targetBusinessUnitId: filters.targetBusinessUnitId });
      }
      
      const businessUnits = await businessUnitsQuery.getMany();
      
      // Get all active services
      const services = await this.serviceRepository.createQueryBuilder('service')
        .leftJoinAndSelect('service.businessUnit', 'businessUnit')
        .where('service.isActive = :isActive', { isActive: true })
        .getMany();
      
      // Get all opportunities
      const opportunities = await this.opportunityRepository.createQueryBuilder('opportunity')
        .leftJoinAndSelect('opportunity.client', 'client')
        .leftJoinAndSelect('opportunity.service', 'service')
        .leftJoinAndSelect('service.businessUnit', 'businessUnit')
        .getMany();
      
      // Generate matrix data
      const matrixItems: CrossSellMatrixItem[] = [];
      
      // For each client
      for (const client of clients) {
        // Get client's current business unit
        const currentBusinessUnit = client.businessUnit;
        
        if (!currentBusinessUnit) {
          continue; // Skip clients without a business unit
        }
        
        // Get client's existing services
        const clientOpportunities = opportunities.filter(opp => opp.client.id === client.id);
        const clientServices = clientOpportunities.map(opp => opp.service);
        const clientServiceIds = new Set(clientServices.map(service => service.id));
        
        // For each potential target business unit (excluding client's current business unit)
        for (const targetBusinessUnit of businessUnits) {
          if (targetBusinessUnit.id === currentBusinessUnit.id) {
            continue; // Skip client's current business unit
          }
          
          // Get services offered by the target business unit
          const targetBusinessUnitServices = services.filter(service => 
            service.businessUnit && service.businessUnit.id === targetBusinessUnit.id
          );
          
          // Filter out services the client already has
          const potentialServices = targetBusinessUnitServices.filter(service => 
            !clientServiceIds.has(service.id)
          );
          
          if (potentialServices.length === 0) {
            continue; // Skip if no potential services
          }
          
          // Calculate opportunity score (0-100)
          const opportunityScore = this.calculateOpportunityScore(
            client,
            currentBusinessUnit,
            targetBusinessUnit,
            clientServices,
            potentialServices
          );
          
          // Apply opportunity score filter if provided
          if (
            filters && 
            filters.minOpportunityScore !== undefined && 
            opportunityScore < filters.minOpportunityScore
          ) {
            continue; // Skip if opportunity score is below minimum
          }
          
          // Get the last engagement date (most recent opportunity with the client)
          const clientOpportunitiesSorted = clientOpportunities.sort((a, b) => 
            b.updatedAt.getTime() - a.updatedAt.getTime()
          );
          const lastEngagementDate = clientOpportunitiesSorted.length > 0 
            ? clientOpportunitiesSorted[0].updatedAt 
            : undefined;
          
          // Create matrix item
          const matrixItem: CrossSellMatrixItem = {
            clientId: client.id,
            clientName: client.name,
            clientIndustry: client.industry,
            clientRegion: client.region,
            currentBusinessUnitId: currentBusinessUnit.id,
            currentBusinessUnitName: currentBusinessUnit.name,
            targetBusinessUnitId: targetBusinessUnit.id,
            targetBusinessUnitName: targetBusinessUnit.name,
            potentialServices: potentialServices.map(service => ({
              id: service.id,
              name: service.name,
              category: service.category,
              description: service.description
            })),
            existingServices: clientServices.map(service => ({
              id: service.id,
              name: service.name,
              category: service.category,
              description: service.description
            })),
            opportunityScore,
            lastEngagementDate
          };
          
          matrixItems.push(matrixItem);
        }
      }
      
      // Sort matrix items by opportunity score (descending)
      matrixItems.sort((a, b) => b.opportunityScore - a.opportunityScore);
      
      return matrixItems;
    } catch (error) {
      console.error('Error in CrossSellMatrixService.generateMatrix:', error);
      throw new Error(`Failed to generate cross-sell matrix: ${error.message}`);
    }
  }

  /**
   * Calculate opportunity score for a cross-sell matrix item
   * @param client Client
   * @param currentBusinessUnit Client's current business unit
   * @param targetBusinessUnit Target business unit
   * @param clientServices Client's existing services
   * @param potentialServices Potential services for the client
   * @returns Opportunity score (0-100)
   */
  private calculateOpportunityScore(
    client: Client,
    currentBusinessUnit: BusinessUnit,
    targetBusinessUnit: BusinessUnit,
    clientServices: Service[],
    potentialServices: Service[]
  ): number {
    // This is a simplified scoring algorithm
    let score = 0;
    
    // Factor 1: Number of potential services (more services = higher score)
    // Max 30 points
    const serviceCountScore = Math.min(potentialServices.length * 10, 30);
    score += serviceCountScore;
    
    // Factor 2: Client value (higher revenue = higher score)
    // Max 30 points
    const clientValueScore = Math.min(client.annualRevenue / 1000000 * 3, 30);
    score += clientValueScore;
    
    // Factor 3: Service category match (matching categories = higher score)
    // Max 20 points
    const clientServiceCategories = new Set(clientServices.map(service => service.category));
    const potentialServiceCategories = potentialServices.map(service => service.category);
    let categoryMatchCount = 0;
    
    for (const category of potentialServiceCategories) {
      if (clientServiceCategories.has(category)) {
        categoryMatchCount++;
      }
    }
    
    const categoryMatchScore = Math.min(categoryMatchCount * 5, 20);
    score += categoryMatchScore;
    
    // Factor 4: Business unit relationship (random for now)
    // Max 20 points
    const businessUnitRelationshipScore = Math.floor(Math.random() * 20);
    score += businessUnitRelationshipScore;
    
    return Math.round(score);
  }

  /**
   * Get cross-sell matrix data for a specific client
   * @param clientId Client ID
   * @returns Promise resolving to an array of cross-sell matrix items for the client
   */
  public async getMatrixForClient(clientId: string): Promise<CrossSellMatrixItem[]> {
    return await this.generateMatrix({ clientId });
  }

  /**
   * Get cross-sell matrix data for a specific business unit as the current business unit
   * @param businessUnitId Business Unit ID
   * @returns Promise resolving to an array of cross-sell matrix items for the business unit
   */
  public async getMatrixForCurrentBusinessUnit(businessUnitId: string): Promise<CrossSellMatrixItem[]> {
    return await this.generateMatrix({ currentBusinessUnitId: businessUnitId });
  }

  /**
   * Get cross-sell matrix data for a specific business unit as the target business unit
   * @param businessUnitId Business Unit ID
   * @returns Promise resolving to an array of cross-sell matrix items for the business unit
   */
  public async getMatrixForTargetBusinessUnit(businessUnitId: string): Promise<CrossSellMatrixItem[]> {
    return await this.generateMatrix({ targetBusinessUnitId: businessUnitId });
  }

  /**
   * Get high opportunity cross-sell matrix items
   * @param minScore Minimum opportunity score (default: 70)
   * @returns Promise resolving to an array of high opportunity cross-sell matrix items
   */
  public async getHighOpportunityMatrix(minScore: number = 70): Promise<CrossSellMatrixItem[]> {
    return await this.generateMatrix({ minOpportunityScore: minScore });
  }
}

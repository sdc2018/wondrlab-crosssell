import { Request, Response } from 'express';
import { OpportunityService } from '../services/OpportunityService';

/**
 * Controller for handling Opportunity-related HTTP requests
 */
export class OpportunityController {
  private static opportunityService = new OpportunityService();

  /**
   * Get all opportunities with optional filtering
   * @param req Express request object
   * @param res Express response object
   */
  public static async getOpportunities(req: Request, res: Response): Promise<void> {
    try {
      const { status, clientId, businessUnitId, serviceId } = req.query;
      const filters = {
        status: status as string,
        clientId: clientId as string,
        businessUnitId: businessUnitId as string,
        serviceId: serviceId as string
      };
      
      const opportunities = await OpportunityController.opportunityService.findAll(filters);
      
      res.status(200).json({
        success: true,
        data: opportunities
      });
    } catch (error) {
      console.error('Error in OpportunityController.getOpportunities:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch opportunities',
        error: error.message
      });
    }
  }

  /**
   * Get an opportunity by ID
   * @param req Express request object
   * @param res Express response object
   */
  public static async getOpportunityById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const opportunity = await OpportunityController.opportunityService.findById(id);
      
      if (!opportunity) {
        res.status(404).json({
          success: false,
          message: `Opportunity with ID ${id} not found`
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: opportunity
      });
    } catch (error) {
      console.error(`Error in OpportunityController.getOpportunityById for ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch opportunity',
        error: error.message
      });
    }
  }

  /**
   * Create a new opportunity
   * @param req Express request object
   * @param res Express response object
   */
  public static async createOpportunity(req: Request, res: Response): Promise<void> {
    try {
      const newOpportunity = await OpportunityController.opportunityService.create(req.body);
      
      res.status(201).json({
        success: true,
        data: newOpportunity,
        message: 'Opportunity created successfully'
      });
    } catch (error) {
      console.error('Error in OpportunityController.createOpportunity:', error);
      
      // Handle validation errors
      if (error.message.includes('required') || 
          error.message.includes('not found')) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to create opportunity',
        error: error.message
      });
    }
  }

  /**
   * Update an existing opportunity
   * @param req Express request object
   * @param res Express response object
   */
  public static async updateOpportunity(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedOpportunity = await OpportunityController.opportunityService.update(id, req.body);
      
      res.status(200).json({
        success: true,
        data: updatedOpportunity,
        message: 'Opportunity updated successfully'
      });
    } catch (error) {
      console.error(`Error in OpportunityController.updateOpportunity for ID ${req.params.id}:`, error);
      
      // Handle not found error
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      // Handle validation errors
      if (error.message.includes('required')) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to update opportunity',
        error: error.message
      });
    }
  }

  /**
   * Delete an opportunity
   * @param req Express request object
   * @param res Express response object
   */
  public static async deleteOpportunity(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await OpportunityController.opportunityService.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'Opportunity deleted successfully'
      });
    } catch (error) {
      console.error(`Error in OpportunityController.deleteOpportunity for ID ${req.params.id}:`, error);
      
      // Handle not found error
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to delete opportunity',
        error: error.message
      });
    }
  }

  /**
   * Update opportunity status
   * @param req Express request object
   * @param res Express response object
   */
  public static async updateOpportunityStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        res.status(400).json({
          success: false,
          message: 'Status is required'
        });
        return;
      }
      
      const updatedOpportunity = await OpportunityController.opportunityService.updateStatus(id, status);
      
      res.status(200).json({
        success: true,
        data: updatedOpportunity,
        message: 'Opportunity status updated successfully'
      });
    } catch (error) {
      console.error(`Error in OpportunityController.updateOpportunityStatus for ID ${req.params.id}:`, error);
      
      // Handle not found error
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      // Handle validation errors
      if (error.message.includes('Invalid status')) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to update opportunity status',
        error: error.message
      });
    }
  }

  /**
   * Get opportunities by client
   * @param req Express request object
   * @param res Express response object
   */
  public static async getOpportunitiesByClient(req: Request, res: Response): Promise<void> {
    try {
      const { clientId } = req.params;
      const opportunities = await OpportunityController.opportunityService.findByClient(clientId);
      
      res.status(200).json({
        success: true,
        data: opportunities
      });
    } catch (error) {
      console.error(`Error in OpportunityController.getOpportunitiesByClient for client ID ${req.params.clientId}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch opportunities by client',
        error: error.message
      });
    }
  }

  /**
   * Get opportunities by business unit
   * @param req Express request object
   * @param res Express response object
   */
  public static async getOpportunitiesByBusinessUnit(req: Request, res: Response): Promise<void> {
    try {
      const { businessUnitId } = req.params;
      const opportunities = await OpportunityController.opportunityService.findByBusinessUnit(businessUnitId);
      
      res.status(200).json({
        success: true,
        data: opportunities
      });
    } catch (error) {
      console.error(`Error in OpportunityController.getOpportunitiesByBusinessUnit for business unit ID ${req.params.businessUnitId}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch opportunities by business unit',
        error: error.message
      });
    }
  }
}

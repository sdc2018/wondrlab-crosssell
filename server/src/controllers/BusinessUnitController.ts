import { Request, Response } from 'express';
import { BusinessUnitService } from '../services/BusinessUnitService';

/**
 * Controller for handling BusinessUnit-related HTTP requests
 */
export class BusinessUnitController {
  private static businessUnitService = new BusinessUnitService();

  /**
   * Get all business units with optional filtering
   * @param req Express request object
   * @param res Express response object
   */
  public static async getBusinessUnits(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.query;
      const filters = {
        name: name as string
      };
      
      const businessUnits = await BusinessUnitController.businessUnitService.findAll(filters);
      
      res.status(200).json({
        success: true,
        data: businessUnits
      });
    } catch (error) {
      console.error('Error in BusinessUnitController.getBusinessUnits:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch business units',
        error: error.message
      });
    }
  }

  /**
   * Get a business unit by ID
   * @param req Express request object
   * @param res Express response object
   */
  public static async getBusinessUnitById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const businessUnit = await BusinessUnitController.businessUnitService.findById(id, ['services', 'opportunities']);
      
      if (!businessUnit) {
        res.status(404).json({
          success: false,
          message: `Business unit with ID ${id} not found`
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: businessUnit
      });
    } catch (error) {
      console.error(`Error in BusinessUnitController.getBusinessUnitById for ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch business unit',
        error: error.message
      });
    }
  }

  /**
   * Create a new business unit
   * @param req Express request object
   * @param res Express response object
   */
  public static async createBusinessUnit(req: Request, res: Response): Promise<void> {
    try {
      // Check if business unit with same name already exists
      if (req.body.name && await BusinessUnitController.businessUnitService.existsByName(req.body.name)) {
        res.status(400).json({
          success: false,
          message: `A business unit with the name "${req.body.name}" already exists`
        });
        return;
      }
      
      const newBusinessUnit = await BusinessUnitController.businessUnitService.create(req.body);
      
      res.status(201).json({
        success: true,
        data: newBusinessUnit,
        message: 'Business unit created successfully'
      });
    } catch (error) {
      console.error('Error in BusinessUnitController.createBusinessUnit:', error);
      
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
        message: 'Failed to create business unit',
        error: error.message
      });
    }
  }

  /**
   * Update an existing business unit
   * @param req Express request object
   * @param res Express response object
   */
  public static async updateBusinessUnit(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Check if business unit with same name already exists (but not the same business unit)
      if (req.body.name) {
        const existingBusinessUnit = await BusinessUnitController.businessUnitService.findById(id);
        const nameExists = await BusinessUnitController.businessUnitService.existsByName(req.body.name);
        
        if (nameExists && existingBusinessUnit && existingBusinessUnit.name !== req.body.name) {
          res.status(400).json({
            success: false,
            message: `A business unit with the name "${req.body.name}" already exists`
          });
          return;
        }
      }
      
      const updatedBusinessUnit = await BusinessUnitController.businessUnitService.update(id, req.body);
      
      res.status(200).json({
        success: true,
        data: updatedBusinessUnit,
        message: 'Business unit updated successfully'
      });
    } catch (error) {
      console.error(`Error in BusinessUnitController.updateBusinessUnit for ID ${req.params.id}:`, error);
      
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
        message: 'Failed to update business unit',
        error: error.message
      });
    }
  }

  /**
   * Delete a business unit
   * @param req Express request object
   * @param res Express response object
   */
  public static async deleteBusinessUnit(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await BusinessUnitController.businessUnitService.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'Business unit deleted successfully'
      });
    } catch (error) {
      console.error(`Error in BusinessUnitController.deleteBusinessUnit for ID ${req.params.id}:`, error);
      
      // Handle not found error
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      // Handle business unit with associated services or opportunities
      if (error.message.includes('associated')) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to delete business unit',
        error: error.message
      });
    }
  }

  /**
   * Get services for a business unit
   * @param req Express request object
   * @param res Express response object
   */
  public static async getBusinessUnitServices(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const services = await BusinessUnitController.businessUnitService.getServicesForBusinessUnit(id);
      
      res.status(200).json({
        success: true,
        data: services
      });
    } catch (error) {
      console.error(`Error in BusinessUnitController.getBusinessUnitServices for ID ${req.params.id}:`, error);
      
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
        message: 'Failed to fetch services for business unit',
        error: error.message
      });
    }
  }

  /**
   * Get opportunities for a business unit
   * @param req Express request object
   * @param res Express response object
   */
  public static async getBusinessUnitOpportunities(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const opportunities = await BusinessUnitController.businessUnitService.getOpportunitiesForBusinessUnit(id);
      
      res.status(200).json({
        success: true,
        data: opportunities
      });
    } catch (error) {
      console.error(`Error in BusinessUnitController.getBusinessUnitOpportunities for ID ${req.params.id}:`, error);
      
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
        message: 'Failed to fetch opportunities for business unit',
        error: error.message
      });
    }
  }
}

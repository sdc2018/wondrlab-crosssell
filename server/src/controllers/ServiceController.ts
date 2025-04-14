import { Request, Response } from 'express';
import { ServiceService } from '../services/ServiceService';

/**
 * Controller for handling Service-related HTTP requests
 */
export class ServiceController {
  private static serviceService = new ServiceService();

  /**
   * Helper method for authentication middleware to get a service
   * This method is used by the auth middleware to check if a user has permission to update a service
   * @param id Service ID
   */
  public static async getServiceForAuth(id: string): Promise<any> {
    try {
      return await ServiceController.serviceService.findById(id);
    } catch (error) {
      console.error(`Error in ServiceController.getServiceForAuth for ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Get all services with optional filtering
   * @param req Express request object
   * @param res Express response object
   */
  public static async getServices(req: Request, res: Response): Promise<void> {
    try {
      const { name, category, businessUnitId, isActive } = req.query;
      const filters = {
        name: name as string,
        category: category as string,
        businessUnitId: businessUnitId as string,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
      };
      
      const services = await ServiceController.serviceService.findAll(filters);
      
      res.status(200).json({
        success: true,
        data: services
      });
    } catch (error) {
      console.error('Error in ServiceController.getServices:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch services',
        error: error.message
      });
    }
  }

  /**
   * Get a service by ID
   * @param req Express request object
   * @param res Express response object
   */
  public static async getServiceById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const service = await ServiceController.serviceService.findById(id);
      
      if (!service) {
        res.status(404).json({
          success: false,
          message: `Service with ID ${id} not found`
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: service
      });
    } catch (error) {
      console.error(`Error in ServiceController.getServiceById for ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch service',
        error: error.message
      });
    }
  }

  /**
   * Create a new service
   * @param req Express request object
   * @param res Express response object
   */
  public static async createService(req: Request, res: Response): Promise<void> {
    try {
      // Check if service with same name already exists
      if (req.body.name && await ServiceController.serviceService.existsByName(req.body.name)) {
        res.status(400).json({
          success: false,
          message: `A service with the name "${req.body.name}" already exists`
        });
        return;
      }
      
      const newService = await ServiceController.serviceService.create(req.body);
      
      res.status(201).json({
        success: true,
        data: newService,
        message: 'Service created successfully'
      });
    } catch (error) {
      console.error('Error in ServiceController.createService:', error);
      
      // Handle validation errors
      if (error.message.includes('required')) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      // Handle business unit not found error
      if (error.message.includes('Business Unit') && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to create service',
        error: error.message
      });
    }
  }

  /**
   * Update an existing service
   * @param req Express request object
   * @param res Express response object
   */
  public static async updateService(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Check if service with same name already exists (but not the same service)
      if (req.body.name) {
        const existingService = await ServiceController.serviceService.findById(id);
        const nameExists = await ServiceController.serviceService.existsByName(req.body.name);
        
        if (nameExists && existingService && existingService.name !== req.body.name) {
          res.status(400).json({
            success: false,
            message: `A service with the name "${req.body.name}" already exists`
          });
          return;
        }
      }
      
      const updatedService = await ServiceController.serviceService.update(id, req.body);
      
      res.status(200).json({
        success: true,
        data: updatedService,
        message: 'Service updated successfully'
      });
    } catch (error) {
      console.error(`Error in ServiceController.updateService for ID ${req.params.id}:`, error);
      
      // Handle not found error
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      // Handle business unit not found error
      if (error.message.includes('Business Unit') && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to update service',
        error: error.message
      });
    }
  }

  /**
   * Delete a service
   * @param req Express request object
   * @param res Express response object
   */
  public static async deleteService(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await ServiceController.serviceService.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'Service deleted successfully'
      });
    } catch (error) {
      console.error(`Error in ServiceController.deleteService for ID ${req.params.id}:`, error);
      
      // Handle not found error
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      // Handle service with associated opportunities
      if (error.message.includes('associated')) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to delete service',
        error: error.message
      });
    }
  }

  /**
   * Get services by business unit
   * @param req Express request object
   * @param res Express response object
   */
  public static async getServicesByBusinessUnit(req: Request, res: Response): Promise<void> {
    try {
      const { businessUnitId } = req.params;
      const services = await ServiceController.serviceService.findByBusinessUnit(businessUnitId);
      
      res.status(200).json({
        success: true,
        data: services
      });
    } catch (error) {
      console.error(`Error in ServiceController.getServicesByBusinessUnit for business unit ID ${req.params.businessUnitId}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch services for business unit',
        error: error.message
      });
    }
  }

  /**
   * Get services by category
   * @param req Express request object
   * @param res Express response object
   */
  public static async getServicesByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const services = await ServiceController.serviceService.findByCategory(category);
      
      res.status(200).json({
        success: true,
        data: services
      });
    } catch (error) {
      console.error(`Error in ServiceController.getServicesByCategory for category ${req.params.category}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch services by category',
        error: error.message
      });
    }
  }

  /**
   * Get active services
   * @param req Express request object
   * @param res Express response object
   */
  public static async getActiveServices(req: Request, res: Response): Promise<void> {
    try {
      const services = await ServiceController.serviceService.findActive();
      
      res.status(200).json({
        success: true,
        data: services
      });
    } catch (error) {
      console.error('Error in ServiceController.getActiveServices:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch active services',
        error: error.message
      });
    }
  }
}
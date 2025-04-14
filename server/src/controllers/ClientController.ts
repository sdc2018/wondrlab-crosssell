import { Request, Response } from 'express';
import { ClientService } from '../services/ClientService';

/**
 * Controller for handling Client-related HTTP requests
 */
export class ClientController {
  private static clientService = new ClientService();

  /**
   * Get all clients with optional filtering
   * @param req Express request object
   * @param res Express response object
   */
  public static async getClients(req: Request, res: Response): Promise<void> {
    try {
      const { industry, status } = req.query;
      const filters = {
        industry: industry as string,
        status: status as string
      };
      
      const clients = await ClientController.clientService.findAll(filters);
      
      res.status(200).json({
        success: true,
        data: clients
      });
    } catch (error) {
      console.error('Error in ClientController.getClients:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch clients',
        error: error.message
      });
    }
  }

  /**
   * Get a client by ID
   * @param req Express request object
   * @param res Express response object
   */
  public static async getClientById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const client = await ClientController.clientService.findById(id, ['contacts', 'engagements', 'opportunities']);
      
      if (!client) {
        res.status(404).json({
          success: false,
          message: `Client with ID ${id} not found`
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: client
      });
    } catch (error) {
      console.error(`Error in ClientController.getClientById for ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch client',
        error: error.message
      });
    }
  }

  /**
   * Create a new client
   * @param req Express request object
   * @param res Express response object
   */
  public static async createClient(req: Request, res: Response): Promise<void> {
    try {
      // Check if client with same name already exists
      if (req.body.name && await ClientController.clientService.existsByName(req.body.name)) {
        res.status(400).json({
          success: false,
          message: `A client with the name "${req.body.name}" already exists`
        });
        return;
      }
      
      const newClient = await ClientController.clientService.create(req.body);
      
      res.status(201).json({
        success: true,
        data: newClient,
        message: 'Client created successfully'
      });
    } catch (error) {
      console.error('Error in ClientController.createClient:', error);
      
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
        message: 'Failed to create client',
        error: error.message
      });
    }
  }

  /**
   * Update an existing client
   * @param req Express request object
   * @param res Express response object
   */
  public static async updateClient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Check if client with same name already exists (but not the same client)
      if (req.body.name) {
        const existingClient = await ClientController.clientService.findById(id);
        const nameExists = await ClientController.clientService.existsByName(req.body.name);
      
        if (nameExists && existingClient && existingClient.name !== req.body.name) {
          res.status(400).json({
          success: false,
            message: `A client with the name "${req.body.name}" already exists`
        });
        return;
        }
      }
      
      const updatedClient = await ClientController.clientService.update(id, req.body);
      
      res.status(200).json({
        success: true,
        data: updatedClient,
        message: 'Client updated successfully'
      });
    } catch (error) {
      console.error(`Error in ClientController.updateClient for ID ${req.params.id}:`, error);
      
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
        message: 'Failed to update client',
        error: error.message
      });
    }
  }

  /**
   * Delete a client
   * @param req Express request object
   * @param res Express response object
   */
  public static async deleteClient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await ClientController.clientService.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'Client deleted successfully'
      });
    } catch (error) {
      console.error(`Error in ClientController.deleteClient for ID ${req.params.id}:`, error);
      
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
        message: 'Failed to delete client',
        error: error.message
      });
    }
  }
}
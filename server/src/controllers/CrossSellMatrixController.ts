import { Request, Response } from 'express';
import { CrossSellMatrixService } from '../services/CrossSellMatrixService';

/**
 * Controller for handling Cross-Sell Matrix related HTTP requests
 */
export class CrossSellMatrixController {
  private static crossSellMatrixService = new CrossSellMatrixService();

  /**
   * Get cross-sell matrix data with optional filtering
   * @param req Express request object
   * @param res Express response object
   */
  public static async getMatrix(req: Request, res: Response): Promise<void> {
    try {
      const { 
        clientId, 
        clientIndustry, 
        clientRegion, 
        currentBusinessUnitId, 
        targetBusinessUnitId, 
        minOpportunityScore 
      } = req.query;
      
      const filters = {
        clientId: clientId as string,
        clientIndustry: clientIndustry as string,
        clientRegion: clientRegion as string,
        currentBusinessUnitId: currentBusinessUnitId as string,
        targetBusinessUnitId: targetBusinessUnitId as string,
        minOpportunityScore: minOpportunityScore ? parseInt(minOpportunityScore as string) : undefined
      };
      
      const matrixData = await CrossSellMatrixController.crossSellMatrixService.generateMatrix(filters);
      
      res.status(200).json({
        success: true,
        data: matrixData
      });
    } catch (error) {
      console.error('Error in CrossSellMatrixController.getMatrix:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate cross-sell matrix',
        error: error.message
      });
    }
  }

  /**
   * Get cross-sell matrix data for a specific client
   * @param req Express request object
   * @param res Express response object
   */
  public static async getMatrixForClient(req: Request, res: Response): Promise<void> {
    try {
      const { clientId } = req.params;
      
      const matrixData = await CrossSellMatrixController.crossSellMatrixService.getMatrixForClient(clientId);
      
      res.status(200).json({
        success: true,
        data: matrixData
      });
    } catch (error) {
      console.error(`Error in CrossSellMatrixController.getMatrixForClient for client ID ${req.params.clientId}:`, error);
      res.status(500).json({
        success: false,
        message: `Failed to generate cross-sell matrix for client with ID ${req.params.clientId}`,
        error: error.message
      });
    }
  }

  /**
   * Get cross-sell matrix data for a specific business unit as the current business unit
   * @param req Express request object
   * @param res Express response object
   */
  public static async getMatrixForCurrentBusinessUnit(req: Request, res: Response): Promise<void> {
    try {
      const { businessUnitId } = req.params;
      
      const matrixData = await CrossSellMatrixController.crossSellMatrixService.getMatrixForCurrentBusinessUnit(businessUnitId);
      
      res.status(200).json({
        success: true,
        data: matrixData
      });
    } catch (error) {
      console.error(`Error in CrossSellMatrixController.getMatrixForCurrentBusinessUnit for business unit ID ${req.params.businessUnitId}:`, error);
      res.status(500).json({
        success: false,
        message: `Failed to generate cross-sell matrix for current business unit with ID ${req.params.businessUnitId}`,
        error: error.message
      });
    }
  }

  /**
   * Get cross-sell matrix data for a specific business unit as the target business unit
   * @param req Express request object
   * @param res Express response object
   */
  public static async getMatrixForTargetBusinessUnit(req: Request, res: Response): Promise<void> {
    try {
      const { businessUnitId } = req.params;
      
      const matrixData = await CrossSellMatrixController.crossSellMatrixService.getMatrixForTargetBusinessUnit(businessUnitId);
      
      res.status(200).json({
        success: true,
        data: matrixData
      });
    } catch (error) {
      console.error(`Error in CrossSellMatrixController.getMatrixForTargetBusinessUnit for business unit ID ${req.params.businessUnitId}:`, error);
      res.status(500).json({
        success: false,
        message: `Failed to generate cross-sell matrix for target business unit with ID ${req.params.businessUnitId}`,
        error: error.message
      });
    }
  }

  /**
   * Get high opportunity cross-sell matrix items
   * @param req Express request object
   * @param res Express response object
   */
  public static async getHighOpportunityMatrix(req: Request, res: Response): Promise<void> {
    try {
      const { minScore } = req.query;
      const minScoreValue = minScore ? parseInt(minScore as string) : 70;
      
      const matrixData = await CrossSellMatrixController.crossSellMatrixService.getHighOpportunityMatrix(minScoreValue);
      
      res.status(200).json({
        success: true,
        data: matrixData
      });
    } catch (error) {
      console.error(`Error in CrossSellMatrixController.getHighOpportunityMatrix with minimum score ${req.query.minScore}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate high opportunity cross-sell matrix',
        error: error.message
      });
    }
  }

  /**
   * Get cross-sell matrix data for a specific industry
   * @param req Express request object
   * @param res Express response object
   */
  public static async getMatrixForIndustry(req: Request, res: Response): Promise<void> {
    try {
      const { industry } = req.params;
      
      const matrixData = await CrossSellMatrixController.crossSellMatrixService.generateMatrix({ clientIndustry: industry });
      
      res.status(200).json({
        success: true,
        data: matrixData
      });
    } catch (error) {
      console.error(`Error in CrossSellMatrixController.getMatrixForIndustry for industry ${req.params.industry}:`, error);
      res.status(500).json({
        success: false,
        message: `Failed to generate cross-sell matrix for industry ${req.params.industry}`,
        error: error.message
      });
    }
  }

  /**
   * Get cross-sell matrix data for a specific region
   * @param req Express request object
   * @param res Express response object
   */
  public static async getMatrixForRegion(req: Request, res: Response): Promise<void> {
    try {
      const { region } = req.params;
      
      const matrixData = await CrossSellMatrixController.crossSellMatrixService.generateMatrix({ clientRegion: region });
      
      res.status(200).json({
        success: true,
        data: matrixData
      });
    } catch (error) {
      console.error(`Error in CrossSellMatrixController.getMatrixForRegion for region ${req.params.region}:`, error);
      res.status(500).json({
        success: false,
        message: `Failed to generate cross-sell matrix for region ${req.params.region}`,
        error: error.message
      });
    }
  }
}

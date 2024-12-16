import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import { CreatingMedicalConditionDto } from '../dto/medical-condition/CreatingMedicalConditionDto';
import { MedicalConditionDto } from '../dto/medical-condition/MedicalConditionDto';

import { Result } from "../core/logic/Result";
import { UpdatingMedicalConditionDto } from '../dto/medical-condition/UpdatingMedicalConditionDto';
import MedicalConditionService from '../services/MedicalConditionService';

@Service()
export default class MedicalConditionController {
  constructor(
    @Inject(config.services.medicalCondition.name) private medicalConditionService: MedicalConditionService
  ) {}

  /**
   * Handles the creation of a new medical condition.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  public async createMedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const resultOrError = await this.medicalConditionService.createMedicalCondition(req.body as CreatingMedicalConditionDto) as Result<MedicalConditionDto>;

      if (resultOrError.isFailure) {
        return res.status(400).send(resultOrError.errorValue()); 
      }

      const medicalConditionDTO = resultOrError.getValue();
      return res.status(201).json(medicalConditionDTO); 
    } catch (error) {
      return next(error); 
    }
  }

  /**
   * Retrieves a medical condition by its ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  public async getMedicalConditionById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id; 
      const resultOrError = await this.medicalConditionService.getMedicalConditionById(id) as Result<MedicalConditionDto>;

      if (resultOrError.isFailure) {
        return res.status(404).send(resultOrError.errorValue()); 
      }

      const medicalConditionDTO = resultOrError.getValue();
      return res.json(medicalConditionDTO); 
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Lists all medical conditions.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  public async listMedicalConditions(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalConditions = await this.medicalConditionService.listMedicalConditions();
      return res.json(medicalConditions); 
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Updates an existing medical condition by its ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  public async updateMedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const resultOrError = await this.medicalConditionService.updateMedicalCondition(req.body as UpdatingMedicalConditionDto) as Result<MedicalConditionDto>;

      if (resultOrError.isFailure) {
        return res.status(400).send(resultOrError.errorValue()); 
      }

      const updatedMedicalConditionDTO = resultOrError.getValue();
      return res.json(updatedMedicalConditionDTO); 
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Deletes a medical condition by its ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  public async deleteMedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id; // Get the ID from the route parameters.
      const resultOrError = await this.medicalConditionService.deleteMedicalCondition(id) as Result<void>;

      if (resultOrError.isFailure) {
        return res.status(404).send(resultOrError.errorValue()); 
      }

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}
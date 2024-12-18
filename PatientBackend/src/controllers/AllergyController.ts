import {Request, Response, NextFunction} from "express";
import {Inject, Service} from "typedi";
import config from "../../config";

import AllergyService from "../services/AllergyService";
import {AllergyDto} from "../dto/allergy/AllergyDto";
import {Result} from "../core/logic/Result";
import {CreatingAllergyDto} from "../dto/allergy/CreatingAllergyDto";


@Service()
export default class AllergyController {
  constructor(
    @Inject(config.services.allergy.name) private allergyService: AllergyService
  ) {}

    /**
     * Handles the creation of a new allergy.
     * @param req
     * @param res
     * @param next
     */
    public async createAllergy(req: Request, res: Response, next: NextFunction) {
      try {
          const resultOrError = await this.allergyService.createAllergy(req.body as CreatingAllergyDto) as Result<AllergyDto>;
          
          if (resultOrError.isFailure) {
              return res.status(400).send(resultOrError.errorValue()); 
          }
    
          const allergyDTO = resultOrError.getValue();
          return res.status(201).json(allergyDTO); 
      } catch (error) {
          return next(error); 
      }
    }
  
}
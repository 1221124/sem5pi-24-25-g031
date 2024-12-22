import {Request, Response, NextFunction} from "express";
import {Inject, Service} from "typedi";
import config from "../../config";

import AllergyService from "../services/AllergyService";
import {AllergyDto} from "../dto/allergy/AllergyDto";
import {Result} from "../core/logic/Result";
import {CreatingAllergyDto} from "../dto/allergy/CreatingAllergyDto";
import {UpdatingAllergyDto} from "../dto/allergy/UpdatingAllergyDto";
import {Description} from "../domain/shared/Description";


@Service()
export default class AllergyController {
    constructor(
        @Inject(config.services.allergy.name) private allergyService: AllergyService
    ) {
    }

    /**
     * Handles the creation of a new allergy.
     * @param req
     * @param res
     * @param next
     */
    public async createAllergy(req: Request, res: Response, next: NextFunction) {
        console.log("CONTROLLER: Creating allergy: ", req.body);
        try {

            const resultOrError = await this.allergyService.createAllergy(req.body as CreatingAllergyDto) as Result<AllergyDto>;

            if (resultOrError.isFailure) {
                return res.status(400).send(resultOrError.errorValue());
            }

            const allergyDTO = resultOrError.getValue();
            return res.status(201).json(allergyDTO);
        } catch (error) {
            console.error("CONTROLLER: Error creating allergy: ", error);
            return next(error);
        }
    }

    /**
     * Retrieves all allergies.
     * @param req
     * @param res
     * @param next
     */
    public async getAllAllergies(req: Request, res: Response, next: NextFunction) {
        try {
            const filters = {
                code: req.query.code as string,
                name: req.query.name as string,
                description: req.query.description as string
            }

            const allergies = await this.allergyService.getAll(filters);

            return res.json(allergies);
        } catch (error) {
            console.log("\nCONTROLLER: Error getting all allergies." + error);
            return next(error);
        }
    }

    /**
     * Updates an allergy.
     * @param req
     * @param res
     * @param next
     */
    public async updateAllergy(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;

            if (!id) {
                return res.status(400).send("Allergy ID is required.");
            }

            const description = req.body.description ?? null;

            const updatingAllergy = new UpdatingAllergyDto(
                Description.create(description).getValue()
            );

            const resultOrError = await this.allergyService.updateAllergy(id, updatingAllergy) as Result<AllergyDto>;

            if (resultOrError.isFailure) {
                return res.status(400).send(resultOrError.errorValue());
            }

            const updatedAllergyDTO = resultOrError.getValue();
            return res.json(updatedAllergyDTO);
        } catch (error) {
            console.error("Error updating allergy: ", error);
            return next(error);
        }
    }

    /**
     * Deletes an allergy.
     * @param req
     * @param res
     * @param next
     */
    public async deleteAllergy(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;

            if (!id) {
                return res.status(400).send("Allergy ID is required.");
            }

            const resultOrError = await this.allergyService.deleteAllergy(id) as Result<void>;

            if (resultOrError.isFailure) {
                return res.status(400).send(resultOrError.errorValue());
            }

            return res.status(204).send();
        } catch (error) {
            console.error("Error deleting allergy: ", error);
            return next(error);
        }
    }

}
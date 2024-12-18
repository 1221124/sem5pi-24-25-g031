import { Request, Response, NextFunction} from "express";

export interface IAllergyController {
    createAllergy(req: Request, res: Response, next: NextFunction): Promise<any>;
}
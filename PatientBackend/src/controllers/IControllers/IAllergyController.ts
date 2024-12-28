import { Request, Response, NextFunction} from "express";

export interface IAllergyController {
    createAllergy(req: Request, res: Response, next: NextFunction): Promise<any>;
    validateICD11Code(req: Request, res: Response, next: NextFunction): Promise<any>;
    getAllAllergies(req: Request, res: Response, next: NextFunction): Promise<any>;
    updateAllergy(req: Request, res: Response, next: NextFunction): Promise<any>;
    deleteAllergy(req: Request, res: Response, next: NextFunction): Promise<any>;
}

import { Request, Response, NextFunction } from 'express';

export interface IMedicalConditionController {
    getAllMedicalConditions(req: Request, res: Response, next: NextFunction): Promise<any>;
    validateICD11Code(req: Request, res: Response, next: NextFunction): Promise<any>;
    getMedicalConditionById(req: Request, res: Response, next: NextFunction): Promise<any>;
    createMedicalCondition(req: Request, res: Response, next: NextFunction): Promise<any>;
    updateMedicalCondition(req: Request, res: Response, next: NextFunction): Promise<any>;
    deleteMedicalCondition(req: Request, res: Response, next: NextFunction): Promise<any>;
}
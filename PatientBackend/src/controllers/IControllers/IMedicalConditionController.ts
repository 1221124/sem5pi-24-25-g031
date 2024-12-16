import { Request, Response, NextFunction } from 'express';

export interface IMedicalConditionController {
    getAllMedicalConditions(): Promise<any>;
    getMedicalConditionById(id: string): Promise<any>;
    createMedicalCondition(req: Request, res: Response, next: NextFunction): Promise<any>;
    updateMedicalCondition(id: string, medicalCondition: any): Promise<any>;
    deleteMedicalCondition(id: string): Promise<any>;
}
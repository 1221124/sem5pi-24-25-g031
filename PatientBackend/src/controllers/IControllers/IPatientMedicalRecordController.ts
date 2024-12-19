import { Request, Response, NextFunction } from 'express';

export interface IPatientMedicalRecordController {
    getAllPatientMedicalRecords(req: Request, res: Response, next: NextFunction): Promise<any>;
    getPatientMedicalRecordById(req: Request, res: Response, next: NextFunction): Promise<any>;
    createPatientMedicalRecord(req: Request, res: Response, next: NextFunction): Promise<any>;
    updatePatientMedicalRecord(req: Request, res: Response, next: NextFunction): Promise<any>;
    deletePatientMedicalRecord(id: string): Promise<any>;
}
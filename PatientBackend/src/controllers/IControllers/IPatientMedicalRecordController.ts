import { Request, Response, NextFunction } from 'express';

export interface IPatientMedicalRecordController {
    getAllPatientMedicalRecords(req: Request, res: Response, next: NextFunction): Promise<any>;
    getPatientMedicalRecordByMedicalRecordNumber(req: Request, res: Response, next: NextFunction): Promise<any>;
    getPatientMedicalRecordById(req: Request, res: Response, next: NextFunction): Promise<any>;
    createPatientMedicalRecord(req: Request, res: Response, next: NextFunction): Promise<any>;
    updatePatientMedicalRecord(req: Request, res: Response, next: NextFunction): Promise<any>;
    addOrUpdateMedicalConditionEntry(req: Request, res: Response, next: NextFunction): Promise<any>;
    addOrUpdateAllergyEntry(req: Request, res: Response, next: NextFunction): Promise<any>;
    deletePatientMedicalRecord(req: Request, res: Response, next: NextFunction): Promise<any>;
    downloadPatientMedicalRecord(req: Request, res: Response, next: NextFunction): Promise<any>;
}
import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";
import IPatientMedicalRecordService from '../services/IServices/IPatientMedicalRecordService';
import { CreatingPatientMedicalRecordDto } from '../dto/patient-medical-record/CreatingPatientMedicalRecordDto';
import { PatientMedicalRecordDto } from '../dto/patient-medical-record/PatientMedicalRecordDto';
import { UpdatingPatientMedicalRecordDto } from '../dto/patient-medical-record/UpdatingPatientMedicalRecordDto';
import mongoose from 'mongoose';
import { MedicalRecordEntry } from '../domain/medical-record-entry/MedicalRecordEntry';

@Service()
export default class PatientMedicalRecordController {
  constructor(
    @Inject(config.services.patientMedicalRecord.name) private patientMedicalRecordService: IPatientMedicalRecordService
  ) {}

  /**
   * Handles the creation of a new patient medical record.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.

   */
  public async createPatientMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Creating patient medical record: ", req.body);

      const resultOrError = await this.patientMedicalRecordService.create(req.body as CreatingPatientMedicalRecordDto) as Result<PatientMedicalRecordDto>;

      if (resultOrError.isFailure) {
        return res.status(400).send(resultOrError.errorValue()); 
      }

      const patientMedicalRecordDto = resultOrError.getValue();
      return res.status(201).json(patientMedicalRecordDto); 
    } catch (error) {
      console.log("Error creating patient medical record: ", error);
      return next(error); 
    }
  }

  /**
   * Retrieves a patient medical record by its medical record number.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  public async getPatientMedicalRecordByMedicalRecordNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalRecordNumber = req.query.medicalRecordNumber as string; 
      const resultOrError = await this.patientMedicalRecordService.getByMedicalRecordNumber(medicalRecordNumber) as Result<PatientMedicalRecordDto>;

      if (resultOrError.isFailure) {
        return res.status(404).send(resultOrError.errorValue()); 
      }

      const patientMedicalRecordDto = resultOrError.getValue();
      return res.json(patientMedicalRecordDto); 
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Retrieves a patient medical record by its ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  public async getPatientMedicalRecordById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id; 
      const resultOrError = await this.patientMedicalRecordService.getById(id) as Result<PatientMedicalRecordDto>;

      if (resultOrError.isFailure) {
        return res.status(404).send(resultOrError.errorValue()); 
      }

      const patientMedicalRecordDto = resultOrError.getValue();
      return res.json(patientMedicalRecordDto); 
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Lists all patient medical records.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  public async getAllPatientMedicalRecords(req: Request, res: Response, next: NextFunction) {
    try {
      const patientMedicalRecords = (await this.patientMedicalRecordService.getAll()).getValue();
      return res.json(patientMedicalRecords); 
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Updates an existing patient medical record by its ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  public async updatePatientMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("req.body = ", req.body);
      console.log("req.params = ", req.params);

      const { id } = req.params;
      if (!id) {
        return res.status(400).send("ID is required.");
      }

      const allergies = req.body.allergies ?? [];
      const medicalConditions = req.body.medicalConditions ?? [];

      const updatingMedicalConditionDto = new UpdatingPatientMedicalRecordDto(
        allergies,
        medicalConditions
      );

      console.log("Update patient medical record: ", updatingMedicalConditionDto);

      const resultOrError = await this.patientMedicalRecordService.update(id, updatingMedicalConditionDto) as Result<PatientMedicalRecordDto>;

      console.log("resultOrError:> " + resultOrError);

      if (resultOrError.isFailure) {
        return res.status(400).send(resultOrError.errorValue()); 
      }

      const updatedPatientMedicalRecordDto = resultOrError.getValue();
      return res.json(updatedPatientMedicalRecordDto); 
    } catch (error) {
      return next(error);
    }
  }
  
  /**
   * Adds or updates an existing medical condition entry in a patient medical record by its ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  public async addOrUpdateMedicalConditionEntry(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("req.body = ", req.body);
      console.log("req.params = ", req.params);

      const { id } = req.params;
      if (!id) {
        return res.status(400).send("ID is required.");
      }

      const code = req.body.code;
      const notMeaningfulAnymore = req.body.notMeaningfulAnymore;
      const date = new Date();

      const medicalCondition = {
        ICD11Code: code,
        Date: date,
        notMeaningfulAnymore: notMeaningfulAnymore
      } as unknown as MedicalRecordEntry;

      const resultOrError = await this.patientMedicalRecordService.addOrUpdateMedicalConditionEntry(id, medicalCondition) as Result<PatientMedicalRecordDto>;

      console.log("resultOrError:> " + resultOrError);

      if (resultOrError.isFailure) {
        return res.status(400).send(resultOrError.errorValue()); 
      }

      const updatedPatientMedicalRecordDto = resultOrError.getValue();
      return res.json(updatedPatientMedicalRecordDto); 
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Adds or updates an existing allergy entry in a patient medical record by its ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  public async addOrUpdateAllergyEntry(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("req.body = ", req.body);
      console.log("req.params = ", req.params);

      const { id } = req.params;
      if (!id) {
        return res.status(400).send("ID is required.");
      }

      const code = req.body.code;
      const notMeaningfulAnymore = req.body.notMeaningfulAnymore;
      const date = new Date();

      const allergy = {
        ICD11Code: code,
        Date: date,
        notMeaningfulAnymore: notMeaningfulAnymore
      } as unknown as MedicalRecordEntry;

      const resultOrError = await this.patientMedicalRecordService.addOrUpdateAllergyEntry(id, allergy) as Result<PatientMedicalRecordDto>;

      console.log("resultOrError:> " + resultOrError);

      if (resultOrError.isFailure) {
        return res.status(400).send(resultOrError.errorValue()); 
      }

      const updatedPatientMedicalRecordDto = resultOrError.getValue();
      return res.json(updatedPatientMedicalRecordDto); 
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Deletes a patient medical record by its ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  public async deletePatientMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id; // Get the ID from the route parameters.
      const resultOrError = await this.patientMedicalRecordService.delete(id) as Result<void>;

      if (resultOrError.isFailure) {
        return res.status(404).send(resultOrError.errorValue()); 
      }

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}
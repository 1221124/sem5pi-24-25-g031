import { Service, Inject } from 'typedi';

import { Document, FilterQuery, Model } from 'mongoose';
import { ICD11Code } from '../domain/shared/ICD11Code';
import { IPatientMedicalRecordPersistence } from '../dataschema/IPatientMedicalRecordPersistence';
import IPatientMedicalRecordRepo from '../services/IRepos/IPatientMedicalRecordRepo';
import { MedicalRecordNumber } from '../domain/patient-medical-record/MedicalRecordNumber';
import { PatientMedicalRecord } from '../domain/patient-medical-record/PatientMedicalRecord';
import { PatientMedicalRecordId } from '../domain/patient-medical-record/PatientMedicalRecordId';
import { PatientMedicalRecordMap } from '../mappers/PatientMedicalRecordMap';
import { Console } from 'console';

@Service()
export default class PatientMedicalRecordRepo implements IPatientMedicalRecordRepo {
  private models: any;

  constructor(
    @Inject('patientMedicalRecordSchema') private patientMedicalRecordSchema: Model<IPatientMedicalRecordPersistence & Document>,
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    };
  }

  /**
   * Check if a patient medical record exists.
   */
  public async exists(patientMedicalRecord: PatientMedicalRecord): Promise<boolean> {
    const idX = patientMedicalRecord.id instanceof PatientMedicalRecordId ? (<PatientMedicalRecordId>patientMedicalRecord.id).toValue() : patientMedicalRecord.id;

    const query = { patientMedicalRecordId: idX };
    const patientMedicalRecordDocument = await this.patientMedicalRecordSchema.findOne(query as FilterQuery<IPatientMedicalRecordPersistence & Document>);

    return !!patientMedicalRecordDocument === true;
  }

  /**
   * Save a patient medical record (create or update).
   */
  public async save(patientMedicalRecord: PatientMedicalRecord): Promise<PatientMedicalRecord> {
    console.log("Saving patient medical record: ", patientMedicalRecord);
    
    const exists = await this.exists(patientMedicalRecord);
    console.log("patient medical record ", exists);
    

    try {
      if (exists) {
        console.log("Exists = true!!!");
        const query = { patientMedicalRecordId : patientMedicalRecord.id };

        console.log("Query: ", query);
        const update = PatientMedicalRecordMap.toPersistence(patientMedicalRecord);
        
        console.log("Update: ", update);
        const patientMedicalRecordRecord = await this.patientMedicalRecordSchema.findOneAndUpdate(query as FilterQuery<IPatientMedicalRecordPersistence & Document>, update, { new: true });
        
        console.log("Record: ", patientMedicalRecordRecord);
        return PatientMedicalRecordMap.toDomain(patientMedicalRecordRecord);
      } else {
        const newPatientMedicalRecord = PatientMedicalRecordMap.toPersistence(patientMedicalRecord);

        const patientMedicalRecordRecord = await this.patientMedicalRecordSchema.create(newPatientMedicalRecord);

        return PatientMedicalRecordMap.toDomain(patientMedicalRecordRecord);
      }
      
      // if (schema === null) {
      //   const rawMedicalCondition: any = PatientMedicalRecordMap.toPersistence(PatientMedicalRecord);

      //   console.log("Raw patient medical record: ", rawMedicalCondition);

      //   const medicalConditionCreated = await this.patientMedicalRecordSchema.create(rawMedicalCondition);

      //   console.log("patient medical record created: ", medicalConditionCreated);

      //   return PatientMedicalRecordMap.toDomain(medicalConditionCreated);
      // } else {
      //   schema.set(PatientMedicalRecordMap.toPersistence(PatientMedicalRecord));

      //   await schema.save();

      //   return PatientMedicalRecordMap.toDomain(schema);
      // }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * Find a patient medical record by its domain ID.
   */
  public async findByDomainId(id: string | string): Promise<PatientMedicalRecord> {
    
    const patientMedicalRecordId = PatientMedicalRecordId.create(id);
    
    console.log("Finding by domain ID: ", patientMedicalRecordId);
    const idx = patientMedicalRecordId instanceof PatientMedicalRecordId ? (<PatientMedicalRecordId>patientMedicalRecordId).toValue() : patientMedicalRecordId;
console.log("IDX: ", idx);
    const query = { patientMedicalRecordId: idx };
    console.log("Query: ", query);
    const patientMedicalRecordRecord = await this.patientMedicalRecordSchema.findOne( query );
console.log("patient medical record record: ", patientMedicalRecordRecord);
    if( patientMedicalRecordRecord != null) {
      console.log("Mapping to domain: ", patientMedicalRecordRecord);
      return PatientMedicalRecordMap.fromPersistence(patientMedicalRecordRecord);
    }
    else return null;
  }

  /**
   * Find a patient medical record by its medical record number.
   */
  public async findByMedicalRecordNumber(number: MedicalRecordNumber): Promise<PatientMedicalRecord | null> {
    const query = { medicalRecordNumber: number.toString() };
    const patientMedicalRecordRecord = await this.patientMedicalRecordSchema.findOne(query as FilterQuery<IPatientMedicalRecordPersistence & Document>);

    if (patientMedicalRecordRecord != null) {
      return PatientMedicalRecordMap.toDomain(patientMedicalRecordRecord);
    } else {
      return null;
    }
  }

  /**
   * Find all patient medical records.
   */
  public async findAll(): Promise<PatientMedicalRecord[]> {
    const patientMedicalRecords = await this.patientMedicalRecordSchema.find();

    if(patientMedicalRecords.length === 0) return [];
    else return Promise.all(patientMedicalRecords.map(PatientMedicalRecordMap.toDomain));
  }

  /**
   * Delete a patient medical record by its ID.
   */
  public async delete(patientMedicalRecord: PatientMedicalRecord): Promise<void> {
    const query = { patientMedicalRecordId: patientMedicalRecord.id.toString() };

    await this.patientMedicalRecordSchema.deleteOne(query as FilterQuery<IPatientMedicalRecordPersistence & Document>);
  }
}

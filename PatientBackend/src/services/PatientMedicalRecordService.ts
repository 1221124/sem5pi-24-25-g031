import { Service, Inject } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";
import IPatientMedicalRecordService from './IServices/IPatientMedicalRecordService';
import IPatientMedicalRecordRepo from './IRepos/IPatientMedicalRecordRepo';
import { PatientMedicalRecordDto } from '../dto/patient-medical-record/PatientMedicalRecordDto';
import { PatientMedicalRecordMap } from '../mappers/PatientMedicalRecordMap';
import { PatientMedicalRecord } from '../domain/patient-medical-record/PatientMedicalRecord';
import { CreatingPatientMedicalRecordDto } from '../dto/patient-medical-record/CreatingPatientMedicalRecordDto';
import { UpdatingPatientMedicalRecordDto } from '../dto/patient-medical-record/UpdatingPatientMedicalRecordDto';
import { MedicalRecordEntry } from '../domain/medical-record-entry/MedicalRecordEntry';

@Service()
export default class PatientMedicalRecordService implements IPatientMedicalRecordService {
  constructor(
    @Inject(config.repos.patientMedicalRecord.name) private patientMedicalRecordRepo: IPatientMedicalRecordRepo
  ) {}

  /**
   * Retrieves a Patient medical record by its ID.
   */
  public async getById(id: string): Promise<Result<PatientMedicalRecordDto>> {
    try {
      const patientMedicalRecord = await this.patientMedicalRecordRepo.findByDomainId(id);

      if (!patientMedicalRecord) {
        return Result.fail<PatientMedicalRecordDto>("Patient medical record not found");
      }

      const patientMedicalRecordDto = PatientMedicalRecordMap.toDto(patientMedicalRecord);
      return Result.ok<PatientMedicalRecordDto>(patientMedicalRecordDto);
    } catch (error) {
      throw error; // Rethrow to be handled by the controller.
    }
  }

  /**
   * Lists all patient medical records.
   */
  public async getAll(): Promise<Result<PatientMedicalRecordDto[]>> {
    try {
      let patientMedicalRecords = await this.patientMedicalRecordRepo.findAll();
      if (patientMedicalRecords == null) patientMedicalRecords = new Array<PatientMedicalRecord>();
      return Result.ok<PatientMedicalRecordDto[]>(patientMedicalRecords.map(PatientMedicalRecordMap.toDto));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new Patient medical record.
   */
  /**
   * Creates a new Patient medical record.
   */
  public async create(dto: CreatingPatientMedicalRecordDto): Promise<Result<PatientMedicalRecordDto>> { 
    try {
      console.log("Creating Patient medical record (service): ", dto);

      const existsOrNot = await this.patientMedicalRecordRepo.findByMedicalRecordNumber(dto.medicalRecordNumber);
      console.log("Exists or Not: " + existsOrNot);

      if(existsOrNot != null) return Result.fail<PatientMedicalRecordDto>("Patient medical record already exists.");
      
      const patientMedicalRecord = await PatientMedicalRecordMap.toDomainfromCreating(dto);
  
      console.log("1 patientMedicalRecord: ", patientMedicalRecord);
      
      if (!patientMedicalRecord) {
        return Result.fail<PatientMedicalRecordDto>("Failed to map Patient medical record DTO to domain.");
      }
  
      console.log("2 creatingMedicalCondition: ", patientMedicalRecord);
  
      console.log("saving Patient medical record");
      const saved = await this.patientMedicalRecordRepo.save(patientMedicalRecord);

      if(saved == null) return Result.fail<PatientMedicalRecordDto>("Failed to save Patient medical record");
  
      const patientMedicalRecordDTO = PatientMedicalRecordMap.toDto(patientMedicalRecord);
      return Result.ok<PatientMedicalRecordDto>(patientMedicalRecordDTO);
    } catch (error) {
      console.log("Error: ", error);
      return Result.fail<PatientMedicalRecordDto>(error.message);
    }
  }  

  /**
   * Updates an existing Patient medical record by its ID.
   */
  public async update(id: string, dto: UpdatingPatientMedicalRecordDto): Promise<Result<PatientMedicalRecordDto>> {
    try {
      console.log("Updating Patient medical record "  + id + " (service): ", dto);
      const original = await this.patientMedicalRecordRepo.findByDomainId(id);

       console.log("Updating Patient medical record found: ", original);

      if (original == null) {
        console.log("Patient medical record not found");
        return Result.fail<PatientMedicalRecordDto>("Patient medical record not found");
      }

      console.log("Updating...");

      if(dto.allergies != null) original.allergies = dto.allergies;
      if(dto.medicalConditions != null) original.medicalConditions = dto.medicalConditions;

      console.log("Updated Patient medical record: ", original);
      
      await this.patientMedicalRecordRepo.save(original);

      const updatedPatientMedicalRecordDto = PatientMedicalRecordMap.toDto(original);
      return Result.ok<PatientMedicalRecordDto>(updatedPatientMedicalRecordDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Adds or updates a medical condition entry in a Patient medical record by its ID.
   */
  public async addOrUpdateMedicalConditionEntry(id: string, medicalCondition: MedicalRecordEntry): Promise<Result<PatientMedicalRecordDto>> {
    try {
      const patientMedicalRecord = await this.patientMedicalRecordRepo.findByDomainId(id);

      if (!patientMedicalRecord) {
        return Result.fail<PatientMedicalRecordDto>("Patient medical record not found");
      }

      patientMedicalRecord.addOrUpdateMedicalConditionEntry(medicalCondition);

      await this.patientMedicalRecordRepo.save(patientMedicalRecord);

      const updatedPatientMedicalRecordDto = PatientMedicalRecordMap.toDto(patientMedicalRecord);
      return Result.ok<PatientMedicalRecordDto>(updatedPatientMedicalRecordDto);
    } catch (error) {
      return Result.fail<PatientMedicalRecordDto>(error.message);
    }
  }

  /**
   * Adds or updates an allergy entry in a Patient medical record by its ID.
   */
  public async addOrUpdateAllergyEntry(id: string, allergy: MedicalRecordEntry): Promise<Result<PatientMedicalRecordDto>> {
    try {
      const patientMedicalRecord = await this.patientMedicalRecordRepo.findByDomainId(id);

      if (!patientMedicalRecord) {
        return Result.fail<PatientMedicalRecordDto>("Patient medical record not found");
      }

      patientMedicalRecord.addOrUpdateAllergyEntry(allergy);

      await this.patientMedicalRecordRepo.save(patientMedicalRecord);

      const updatedPatientMedicalRecordDto = PatientMedicalRecordMap.toDto(patientMedicalRecord);
      return Result.ok<PatientMedicalRecordDto>(updatedPatientMedicalRecordDto);
    } catch (error) {
      return Result.fail<PatientMedicalRecordDto>(error.message);
    }
  }

  /**
   * Deletes a Patient medical record by its ID.
   */
  public async delete(id: string): Promise<Result<void>> {
    try {
      const medicalCondition = await this.patientMedicalRecordRepo.findByDomainId(id);

      if (!medicalCondition) {
        return Result.fail<void>("Patient medical record not found");
      }

      await this.patientMedicalRecordRepo.delete(medicalCondition);
      return Result.ok<void>();
    } catch (error) {
      throw error;
    }
  }
}

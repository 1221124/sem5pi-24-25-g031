import { Service, Inject } from 'typedi';
import config from "../../config";

import { MedicalConditionDto } from "../dto/medical-condition/MedicalConditionDto";
import { CreatingMedicalConditionDto } from "../dto/medical-condition/CreatingMedicalConditionDto";
import { MedicalConditionMap } from "../mappers/MedicalConditionMap";

import { Result } from "../core/logic/Result";

import IMedicalConditionRepo from "../services/IRepos/IMedicalConditionRepo";
import { UpdatingMedicalConditionDto } from '../dto/medical-condition/UpdatingMedicalConditionDto';
import IMedicalConditionService from './IServices/IMedicalConditionService';
import e from 'cors';
import { MedicalCondition } from '../domain/medical-condition/MedicalCondition';
import { ICD11Code } from '../domain/shared/ICD11Code';

@Service()
export default class MedicalConditionService implements IMedicalConditionService {

  constructor(
    @Inject(config.repos.medicalCondition.name) private medicalConditionRepo: IMedicalConditionRepo
  ) {}

  /**
   * Retrieves a medical condition by its ID.
   */
  public async getMedicalConditionById(id: string): Promise<Result<MedicalConditionDto>> {
    try {
      const medicalCondition = await this.medicalConditionRepo.findByDomainId(id);

      if (!medicalCondition) {
        return Result.fail<MedicalConditionDto>("Medical condition not found");
      }

      const medicalConditionDTO = MedicalConditionMap.toDto(medicalCondition);
      return Result.ok<MedicalConditionDto>(medicalConditionDTO);
    } catch (error) {
      throw error; // Rethrow to be handled by the controller.
    }
  }

  /**
   * Lists all medical conditions.
   */
  public async getAll(): Promise<MedicalConditionDto[]> {
    try {
      const medicalConditions = await this.medicalConditionRepo.findAll();
      return medicalConditions.map(MedicalConditionMap.toDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validates an ICD-11 code.
   */
  public async validateICD11Code(code: string): Promise<Result<boolean>> {
    try {
      const icd11Code = ICD11Code.create(code);
      if (icd11Code.isFailure) {
        return Result.fail<boolean>(icd11Code.error);
      }
      const exists = await this.medicalConditionRepo.findByCode(icd11Code.getValue());
      //returns true if the code exists, false otherwise
      return Result.ok<boolean>(exists != null);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new medical condition.
   */
  /**
   * Creates a new medical condition.
   */
  public async createMedicalCondition(dto: CreatingMedicalConditionDto): Promise<Result<MedicalConditionDto>> { 
    try {
      console.log("Creating medical condition (service): ", dto);

      const existsOrNot = await this.medicalConditionRepo.findByCode(dto.code);
      console.log("Exists or Not: " + existsOrNot);

      if(existsOrNot != null) return Result.fail<MedicalConditionDto>("Medical Condition already exists.");
  
      const medicalConditionDto = await MedicalConditionMap.toDomain(dto);
  
      console.log("1 medicalConditionDto: ", medicalConditionDto);
      
      if (!medicalConditionDto) {
        return Result.fail<MedicalConditionDto>("Failed to map medical condition DTO to domain.");
      }
  
      console.log("2 creatingMedicalCondition: ", medicalConditionDto);
  
      console.log("saving medical condition");
      const saved = await this.medicalConditionRepo.save(medicalConditionDto);

      if(saved == null) return Result.fail<MedicalConditionDto>("Failed to save medical condition");
  
      const medicalConditionDTO = MedicalConditionMap.toDto(medicalConditionDto);
      return Result.ok<MedicalConditionDto>(medicalConditionDTO);
    } catch (error) {
      console.log("Error: ", error);
      return Result.fail<MedicalConditionDto>(error.message);
    }
  }  

  /**
   * Updates an existing medical condition by its ID.
   */
  public async updateMedicalCondition(id: string, dto: UpdatingMedicalConditionDto): Promise<Result<MedicalConditionDto>> {
    try {
      console.log("Updating medical condition "  + id + " (service): ", dto);
      const original = await this.medicalConditionRepo.findByDomainId(id);

       console.log("Updating medical condition found: ", original);

      if (original == null) {
        console.log("Medical condition not found");
        return Result.fail<MedicalConditionDto>("Medical condition not found");
      }

      console.log("Updating...");

      if(dto.description != null) original.description = dto.description;
      if(dto.commonSymptoms.length > 0) original.commonSymptoms = dto.commonSymptoms;

      console.log("Updated medical condition: ", original);
      

      // Save the updated medical condition entity.
      await this.medicalConditionRepo.save(original);

      const updatedMedicalConditionDTO = MedicalConditionMap.toDto(original);
      return Result.ok<MedicalConditionDto>(updatedMedicalConditionDTO);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a medical condition by its ID.
   */
  public async deleteMedicalCondition(id: string): Promise<Result<void>> {
    try {
      const medicalCondition = await this.medicalConditionRepo.findByDomainId(id);

      if (!medicalCondition) {
        return Result.fail<void>("Medical condition not found");
      }

      await this.medicalConditionRepo.delete(medicalCondition);
      return Result.ok<void>();
    } catch (error) {
      throw error;
    }
  }
}

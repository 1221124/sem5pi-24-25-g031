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
   * Creates a new medical condition.
   */
  /**
   * Creates a new medical condition.
   */
  public async createMedicalCondition(dto: CreatingMedicalConditionDto): Promise<Result<MedicalConditionDto>> { 
    try {
      console.log("Creating medical condition (service): ", dto);
  
      const medicalConditionDto = await MedicalConditionMap.toDomain(dto);
  
      console.log("1 medicalConditionDto: ", medicalConditionDto);
      
      if (!medicalConditionDto) {
        return Result.fail<MedicalConditionDto>("Failed to map medical condition DTO to domain.");
      }
  
      console.log("2 creatingMedicalCondition: ", medicalConditionDto);
  
      console.log("saving medical condition");
      await this.medicalConditionRepo.save(medicalConditionDto);
  
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
  public async updateMedicalCondition(dto: UpdatingMedicalConditionDto): Promise<Result<MedicalConditionDto>> {
    try {
     const medicalCondition = await this.medicalConditionRepo.findByDomainId(dto.id.toString());

      if (medicalCondition == null) {
        return Result.fail<MedicalConditionDto>("Medical condition not found");
      }

      // Update fields on the existing medical condition entity.
      console.log("fake update");
      //medicalCondition.updateFromRequest(dto);
      

      // Save the updated medical condition entity.
      await this.medicalConditionRepo.save(medicalCondition);

      const updatedMedicalConditionDTO = MedicalConditionMap.toDto(medicalCondition);
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

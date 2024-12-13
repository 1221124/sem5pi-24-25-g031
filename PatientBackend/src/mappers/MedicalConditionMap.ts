import { MedicalCondition } from "../domain/medical-condition/MedicalCondition";
import { CreatingMedicalConditionDto } from "../dto/medical-condition/CreatingMedicalConditionDto";
import { MedicalConditionDto } from "../dto/medical-condition/MedicalConditionDto";

export class MedicalConditionMap {
    static toDto(medicalCondition: MedicalCondition): MedicalConditionDto {
      return new MedicalConditionDto(
        medicalCondition.code, 
        medicalCondition.name, 
        medicalCondition.description, 
        medicalCondition.commonSymptoms
      );
    }
  
    static toEntity(medicalConditionDto: MedicalConditionDto): MedicalCondition {
      return new MedicalCondition(
        medicalConditionDto.code, 
        medicalConditionDto.name, 
        medicalConditionDto.description, 
        medicalConditionDto.commonSymptoms
      );
    }
  
    static toEntityFromCreating(CreatingMedicalConditionDto: CreatingMedicalConditionDto): MedicalCondition {
      return new MedicalCondition(
        CreatingMedicalConditionDto.code, 
        CreatingMedicalConditionDto.name, 
        CreatingMedicalConditionDto.description, 
        CreatingMedicalConditionDto.commonSymptoms
      );
    }
  }
  
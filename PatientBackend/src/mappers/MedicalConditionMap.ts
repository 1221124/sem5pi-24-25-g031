import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { CommonSymptom } from "../domain/medical-condition/CommonSyptom";
import { MedicalCondition } from "../domain/medical-condition/MedicalCondition";
import { Description } from "../domain/shared/Description";
import { ICD11Code } from "../domain/shared/ICD11Code";
import { Name } from "../domain/shared/Name";
import { CreatingMedicalConditionDto } from "../dto/medical-condition/CreatingMedicalConditionDto";
import { MedicalConditionDto } from "../dto/medical-condition/MedicalConditionDto";

export class MedicalConditionMap {
    public  static toDto(medicalCondition: MedicalCondition): MedicalConditionDto {
      return {
        code: medicalCondition.code, 
        name: medicalCondition.name, 
        description: medicalCondition.description, 
        commonSymptoms: medicalCondition.commonSymptoms
      } as MedicalConditionDto;
    }
  
    public static async toDomain(raw: any): Promise<MedicalCondition> {
      const codeOrError = ICD11Code.create(raw.code);
      const nameOrError = Name.create(raw.name);
      const descriptionOrError = Description.create(raw.description);
      const commonSymptomsOrError = raw.commonSymptom.map((symptom: any) => CommonSymptom.create(symptom));

      const medicalConditionOrError = MedicalCondition.create({
        code: codeOrError.getValue(),
        name: nameOrError.getValue(),
        description: descriptionOrError.getValue(),
        commonSymptoms: commonSymptomsOrError.map(
          (symptomOrError: any) => symptomOrError.getValue())
      }, new UniqueEntityID(raw.medicalConditionId));

      medicalConditionOrError.isFailure ? console.log(medicalConditionOrError.error) : '';

      return medicalConditionOrError.isSuccess ? medicalConditionOrError.getValue() : null;
    }

    public static toPersistence (medicalCondition: MedicalCondition): any {
      return {
        medicalConditionId: medicalCondition.id.toString(),
        code: medicalCondition.code.value,
        name: medicalCondition.name.value,
        description: medicalCondition.description.value,
        commonSymptoms: medicalCondition.commonSymptoms.map(symptom => symptom.value)
      };
    }
  }
  
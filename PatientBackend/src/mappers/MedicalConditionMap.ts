import { cp } from "fs";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { CommonSymptom } from "../domain/medical-condition/CommonSyptom";
import { MedicalCondition } from "../domain/medical-condition/MedicalCondition";
import { Description } from "../domain/shared/Description";
import { ICD11Code } from "../domain/shared/ICD11Code";
import { Name } from "../domain/shared/Name";
import { CreatingMedicalConditionDto } from "../dto/medical-condition/CreatingMedicalConditionDto";
import { MedicalConditionDto } from "../dto/medical-condition/MedicalConditionDto";
import { MedicalConditionId } from "../domain/medical-condition/MedicalConditionId";

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
      try{
        const codeOrError = ICD11Code.create(raw.code);
        if (codeOrError.isFailure)
          throw new Error("ICD11 code failed validation.");

        const code = codeOrError.getValue();
        console.log("code :> " + code);

        const nameOrError = Name.create(raw.name);
        if (nameOrError.isFailure)
          throw new Error("ICD11 code failed validation.");

        const name = nameOrError.getValue();
        console.log("name :> " + name);

        const descriptionOrError = Description.create(raw.description);
        if (descriptionOrError.isFailure)
          throw new Error("ICD11 code failed validation.");
        
        const description = descriptionOrError.getValue();
        console.log("description :> " + description);

        if (!Array.isArray(raw.commonSymptoms) || raw.commonSymptoms.length === 0) {
          throw new Error("Common symptoms are required.");
        }

        const commonSymptomsOrError = raw.commonSymptoms.map((symptom: any) => CommonSymptom.create(symptom));
        if (commonSymptomsOrError.some((result: any) => result.isFailure)) {
          throw new Error("One or more common symptoms failed validation.");
        }
                  
        const commonSymptoms = commonSymptomsOrError.map((result: any) => result.getValue());
        console.log("commonSymptoms :> " + commonSymptoms);

      
        const medicalConditionOrError = MedicalCondition.create({
            code: code,
            name: name,
            description: description,
            commonSymptoms: commonSymptoms // Now plain values
        }, new UniqueEntityID(raw.domainId));

        console.log("Medical condition or error: ", medicalConditionOrError);

        medicalConditionOrError.isFailure ? console.log("medicalConditionOrError" + medicalConditionOrError.error) : '';

        return medicalConditionOrError.isSuccess ? medicalConditionOrError.getValue() : null;
      } catch (error) {
        console.log("Error mapping to domain: ", error);
        throw error;
      }
    }

    public static toPersistence(medicalCondition: MedicalCondition): any {
      return {
        medicalConditionId: medicalCondition.id, 
        code: medicalCondition.code.value,
        name: medicalCondition.name.value,
        description: medicalCondition.description.value,
        commonSymptoms: medicalCondition.commonSymptoms.map((symptom) => {
          console.log("symptom :> " + symptom.value); 
          return symptom.value; 
        }),
      };
    }
    
  }
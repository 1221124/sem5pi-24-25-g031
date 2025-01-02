import { CommonSymptom } from "../../domain/medical-condition/CommonSyptom";
import { Description } from "../../domain/shared/Description";
import { ICD11Code } from "../../domain/shared/ICD11Code";
import { Name } from "../../domain/shared/Name";
import { MedicalCondition } from "../../domain/medical-condition/MedicalCondition";
import { Result } from "../../core/logic/Result";

export class CreatingMedicalConditionDto {
    code: ICD11Code;
    name: Name;
    description: Description;
    commonSymptoms: CommonSymptom[];

    constructor (code: ICD11Code, name: Name, description: Description, commonSymptoms: CommonSymptom[]) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.commonSymptoms = commonSymptoms;
    }
    
    public static create(codeValue: string, nameValue: string, descriptionValue: string, commonSymptomsValue: string[]): Result<CreatingMedicalConditionDto>{
        const code = ICD11Code.create(codeValue);
        const name = Name.create(nameValue);
        const description = Description.create(descriptionValue);
        const commonSymptomsResults = commonSymptomsValue.map(symptom => CommonSymptom.create(symptom));
        const commonSymptoms = commonSymptomsResults.map(result => result.getValue());
        
        const medicalConditionDto = new CreatingMedicalConditionDto(
            code.getValue(),
            name.getValue(),
            description.getValue(),
            commonSymptoms
        )
        
        return Result.ok<CreatingMedicalConditionDto>(medicalConditionDto)
    }
}
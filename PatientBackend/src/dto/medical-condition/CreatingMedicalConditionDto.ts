import { CommonSymptom } from "../../domain/medical-condition/CommonSyptom";
import { Description } from "../../domain/shared/Description";
import { ICD11Code } from "../../domain/shared/ICD11Code";
import { Name } from "../../domain/shared/Name";

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
}
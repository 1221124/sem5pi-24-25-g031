import { CommonSymptom } from "../../domain/medical-condition/CommonSyptom";
import { Description } from "../../domain/shared/Description";
import { ICD11Code } from "../../domain/shared/ICD11Code";
import { Name } from "../../domain/shared/Name";

export class MedicalConditionDto {
    id: string; 
    code: ICD11Code;
    name: Name;
    description: Description;
    commonSymptoms: CommonSymptom[];

    constructor (id: string, code: ICD11Code, name: Name, description: Description, commonSymptoms: CommonSymptom[]) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.commonSymptoms = commonSymptoms;
    }
}
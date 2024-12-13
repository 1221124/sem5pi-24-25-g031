import { CommonSymptom } from "../../domain/medical-condition/CommonSyptom";
import { MedicalCondition } from "../../domain/medical-condition/MedicalCondition";
import { MedicalConditionId } from "../../domain/medical-condition/MedicalConditionId";
import { Description } from "../../domain/shared/Description";

export class UpdatingMedicalConditionDto {
    id: MedicalConditionId;
    description: Description;
    commonSymptoms: CommonSymptom[];

    constructor (id: MedicalConditionId, description: Description, commonSymptoms: CommonSymptom[]) {
        this.id = id;
        this.description = description;
        this.commonSymptoms = commonSymptoms;
    }
}
import { CommonSymptom } from "../../domain/medical-condition/CommonSyptom";
import { MedicalCondition } from "../../domain/medical-condition/MedicalCondition";
import { MedicalConditionId } from "../../domain/medical-condition/MedicalConditionId";
import { Description } from "../../domain/shared/Description";

export class UpdatingMedicalConditionDto {
    description: Description;
    commonSymptoms: CommonSymptom[];

    constructor (description: Description, commonSymptoms: CommonSymptom[]) {
        this.description = description ?? Description.create(null).getValue();
        this.commonSymptoms = commonSymptoms ?? null;
    }

    public static create (description: Description, commonSymptoms: CommonSymptom[]): UpdatingMedicalConditionDto {
        return new UpdatingMedicalConditionDto(description, commonSymptoms);
    }

}
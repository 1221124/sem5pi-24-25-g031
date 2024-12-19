import { ICD11Code } from "../../domain/shared/ICD11Code";

export class UpdatingPatientMedicalRecordDto {
    allergies: ICD11Code[];
    medicalConditions: ICD11Code[];

    constructor (allergies: ICD11Code[], medicalConditions: ICD11Code[]) {
        this.allergies = allergies;
        this.medicalConditions = medicalConditions;
    }

    public static create (allergies: ICD11Code[], medicalConditions: ICD11Code[]): UpdatingPatientMedicalRecordDto {
        return new UpdatingPatientMedicalRecordDto(allergies, medicalConditions);
    }

}
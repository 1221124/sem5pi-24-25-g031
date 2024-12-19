import { MedicalRecordEntry } from "../../domain/medical-record-entry/MedicalRecordEntry";

export class UpdatingPatientMedicalRecordDto {
    allergies: MedicalRecordEntry[];
    medicalConditions: MedicalRecordEntry[];

    constructor (allergies: MedicalRecordEntry[], medicalConditions: MedicalRecordEntry[]) {
        this.allergies = allergies;
        this.medicalConditions = medicalConditions;
    }

    public static create (allergies: MedicalRecordEntry[], medicalConditions: MedicalRecordEntry[]): UpdatingPatientMedicalRecordDto {
        return new UpdatingPatientMedicalRecordDto(allergies, medicalConditions);
    }

}
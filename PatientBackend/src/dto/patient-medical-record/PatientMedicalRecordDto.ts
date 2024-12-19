import { MedicalRecordNumber } from "../../domain/patient-medical-record/MedicalRecordNumber";
import { ICD11Code } from "../../domain/shared/ICD11Code";

export class PatientMedicalRecordDto {
    medicalRecordNumber: MedicalRecordNumber;
    allergies: ICD11Code[];
    medicalConditions: ICD11Code[];

    constructor (medicalRecordNumber: MedicalRecordNumber, allergies: ICD11Code[], medicalConditions: ICD11Code[]) {
        this.medicalRecordNumber = medicalRecordNumber;
        this.allergies = allergies;
        this.medicalConditions = medicalConditions;
    }
}
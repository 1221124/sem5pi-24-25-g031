import { MedicalRecordNumber } from "../../domain/patient-medical-record/MedicalRecordNumber";
import { ICD11Code } from "../../domain/shared/ICD11Code";

export class PatientMedicalRecordDto {
    id: string;
    medicalRecordNumber: MedicalRecordNumber;
    allergies: ICD11Code[];
    medicalConditions: ICD11Code[];

    constructor (id: string, medicalRecordNumber: MedicalRecordNumber, allergies: ICD11Code[], medicalConditions: ICD11Code[]) {
        this.id = id;
        this.medicalRecordNumber = medicalRecordNumber;
        this.allergies = allergies;
        this.medicalConditions = medicalConditions;
    }
}
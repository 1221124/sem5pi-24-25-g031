import { MedicalRecordEntry } from "../../domain/medical-record-entry/MedicalRecordEntry";
import { MedicalRecordNumber } from "../../domain/patient-medical-record/MedicalRecordNumber";

export class PatientMedicalRecordDto {
    id: string;
    medicalRecordNumber: MedicalRecordNumber;
    allergies: MedicalRecordEntry[];
    medicalConditions: MedicalRecordEntry[];

    constructor (id: string, medicalRecordNumber: MedicalRecordNumber, allergies: MedicalRecordEntry[], medicalConditions: MedicalRecordEntry[]) {
        this.id = id;
        this.medicalRecordNumber = medicalRecordNumber;
        this.allergies = allergies;
        this.medicalConditions = medicalConditions;
    }
}
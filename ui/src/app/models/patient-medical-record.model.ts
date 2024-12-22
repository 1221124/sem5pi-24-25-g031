import { MedicalRecordEntry } from "./medical-record-entry";

export interface PatientMedicalRecord {
    Id: string;
    MedicalRecordNumber: string;
    Allergies: MedicalRecordEntry[];
    MedicalConditions: MedicalRecordEntry[];
}
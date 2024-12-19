import { MedicalRecordNumber } from "../../domain/patient-medical-record/MedicalRecordNumber";

export class CreatingPatientMedicalRecordDto {
    medicalRecordNumber: MedicalRecordNumber;

    constructor (medicalRecordNumber: MedicalRecordNumber) {
        this.medicalRecordNumber = medicalRecordNumber;
    }
}
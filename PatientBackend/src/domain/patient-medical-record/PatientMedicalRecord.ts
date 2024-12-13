import { Allergy } from "../allergy/Allergy";
import { MedicalCondition } from "../medical-condition/MedicalCondition";
import { MedicalRecordNumber } from "./MedicalRecordNumber";

export class PatientMedicalRecord {
    private medicalRecordNumber: MedicalRecordNumber;
    private allergies: Allergy[];
    private medicalConditions: MedicalCondition[];
}
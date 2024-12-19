export interface IPatientMedicalRecordPersistence {
    domainId: string;
    medicalRecordNumber: string;
    allergies: string[];
    medicalConditions: string[];
  }
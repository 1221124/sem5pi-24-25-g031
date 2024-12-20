export interface PatientMedicalRecord {
    Id: string;
    MedicalRecordNumber: string;
    Allergies: {
        ICD11Code: string;
        Date: Date;
        notMeaningfulAnymore: boolean;
    }[];
    MedicalConditions: {
        ICD11Code: string;
        Date: Date;
        notMeaningfulAnymore: boolean;
    }[];
}
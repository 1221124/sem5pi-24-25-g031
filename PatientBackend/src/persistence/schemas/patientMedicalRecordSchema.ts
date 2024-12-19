import { IPatientMedicalRecordPersistence } from "../../dataschema/IPatientMedicalRecordPersistence"; 
import mongoose from "mongoose";

const PatientMedicalRecordSchema = new mongoose.Schema(
    {
        patientMedicalRecordId: {
            type: String,
            required: true
        },
        medicalRecordNumber: {
            type: String,
            required: [true, 'Please enter medical record number'],
        },
        allergies: {
            type: [String],
            required: [true, 'Please enter allergies'],
        },
        medicalConditions: {
            type: [String],
            required: [true, 'Please enter medical conditions'],
        }
    }
); 

export default mongoose.model<IPatientMedicalRecordPersistence & mongoose.Document>('PatientMedicalRecord', PatientMedicalRecordSchema);
import { IPatientMedicalRecordPersistence } from "../../dataschema/IPatientMedicalRecordPersistence"; 
import mongoose from "mongoose";

const PatientMedicalRecordSchema = new mongoose.Schema(
    {
        patientMedicalRecordId: {
            type: String,
            unique: true
        },
        medicalRecordNumber: {
            type: String,
            required: [true, 'Please enter a medical record number'],
            unique: [true, 'Please enter an unique medical record number'],
        },
        allergies: {
            type: [String],
            required: [true, 'Please enter allergies'],
        },
        medicalConditions: {
            type: [String],
            required: [true, 'Please enter medical conditions'],
        }
    },
    {
      timestamps: true
    }
); 

export default mongoose.model<IPatientMedicalRecordPersistence & mongoose.Document>('PatientMedicalRecord', PatientMedicalRecordSchema);
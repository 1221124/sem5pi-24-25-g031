import { IMedicalConditionPersistence } from "../../dataschema/IMedicalConditionPersistence";
import mongoose from "mongoose";

const MedicalConditionSchema = new mongoose.Schema(
    {
        medicalConditionId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: [true, 'Please enter name'],
        },
        code: {
            type: String,
            required: [true, 'Please enter code'],
        },  
        description: {
            type: String,
            required: [true, 'Please enter description'],
        },
        commonSymptoms: {
            type: [String],
            required: [true, 'Please enter common symptoms'],
        },
    }
); 

export default mongoose.model<IMedicalConditionPersistence & mongoose.Document>('MedicalCondition', MedicalConditionSchema);
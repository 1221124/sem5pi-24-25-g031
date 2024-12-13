import { IMedicalConditionPersistence } from "../../dataschema/IMedicalConditionPersistence";
import mongoose from "mongoose";

const MedicalCondition = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: [true, 'Please enter name'],
            index: true,
        },
        code: {
            type: String,
            required: [true, 'Please enter code'],
            index: true,
        },  
        description: {
            type: String,
            required: [true, 'Please enter description'],
            index: true,
        },
        commonSymptoms: {
            type: Array,
            required: [true, 'Please enter common symptoms'],
            index: true,
        },
    }
); 

export default mongoose.model<IMedicalConditionPersistence & mongoose.Document>('MedicalCondition', MedicalCondition);
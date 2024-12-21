import mongoose from "mongoose";
import {IAllergyPersistence} from "../../dataschema/IAllergyPersistence";

const AllergySchema = new mongoose.Schema(
    {
        allergyId: {
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
    }
);

export default mongoose.model<IAllergyPersistence & mongoose.Document>('Allergy', AllergySchema);
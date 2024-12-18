import mongoose from "mongoose";

const commonSymptomSchema = new mongoose.Schema({
    value: { type: String, required: true },
});

const CommonSymptom = mongoose.model('CommonSymptom', commonSymptomSchema);

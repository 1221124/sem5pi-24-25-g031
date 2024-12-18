"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MedicalConditionSchema = new mongoose_1.default.Schema({
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
});
exports.default = mongoose_1.default.model('MedicalCondition', MedicalConditionSchema);
//# sourceMappingURL=medicalConditionSchema.js.map
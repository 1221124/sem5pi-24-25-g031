"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MedicalCondition = new mongoose_1.default.Schema({
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
});
exports.default = mongoose_1.default.model('MedicalCondition', MedicalCondition);
//# sourceMappingURL=medicalConditionSchema.js.map
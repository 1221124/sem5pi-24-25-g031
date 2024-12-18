"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commonSymptomSchema = new mongoose_1.default.Schema({
    value: { type: String, required: true },
});
const CommonSymptom = mongoose_1.default.model('CommonSymptom', commonSymptomSchema);
//# sourceMappingURL=CommonSymptomSchema.js.map
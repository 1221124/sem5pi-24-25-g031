"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AllergySchema = new mongoose_1.default.Schema({
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
});
exports.default = mongoose_1.default.model('Allergy', AllergySchema);
//# sourceMappingURL=allergySchema.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User = new mongoose_1.default.Schema({
    domainId: {
        type: String,
        unique: true
    },
    firstName: {
        type: String,
        required: [true, 'Please enter first name'],
        index: true,
    },
    lastName: {
        type: String,
        required: [true, 'Please enter last name'],
        index: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        index: true,
    },
    password: String,
    salt: String,
    role: {
        type: String,
        default: 'user',
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model('User', User);
//# sourceMappingURL=userSchema.js.map
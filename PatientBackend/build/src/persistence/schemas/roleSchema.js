"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RoleSchema = new mongoose_1.default.Schema({
    domainId: { type: String, unique: true },
    name: { type: String, unique: true }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Role', RoleSchema);
//# sourceMappingURL=roleSchema.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalConditionId = void 0;
const UniqueEntityID_1 = require("../../core/domain/UniqueEntityID");
class MedicalConditionId extends UniqueEntityID_1.UniqueEntityID {
    constructor(id) {
        super(id);
    }
    static create(id) {
        return new MedicalConditionId(id);
    }
}
exports.MedicalConditionId = MedicalConditionId;
//# sourceMappingURL=MedicalConditionId.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalCondition = void 0;
const MedicalConditionId_1 = require("./MedicalConditionId");
class MedicalCondition {
    constructor(code, name, description, commonSymptoms) {
        this.id = new MedicalConditionId_1.MedicalConditionId();
        this.code = code;
        this.name = name;
        this.description = description;
        this.commonSymptoms = commonSymptoms;
    }
    updateFromRequest(request) {
        if (request.description) {
            this.description = request.description;
        }
        if (request.commonSymptoms) {
            this.commonSymptoms = request.commonSymptoms;
        }
    }
}
exports.MedicalCondition = MedicalCondition;
//# sourceMappingURL=MedicalCondition.js.map
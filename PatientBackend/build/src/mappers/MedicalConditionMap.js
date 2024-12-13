"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalConditionMap = void 0;
const MedicalCondition_1 = require("../domain/medical-condition/MedicalCondition");
const MedicalConditionDto_1 = require("../dto/medical-condition/MedicalConditionDto");
class MedicalConditionMap {
    static toDto(medicalCondition) {
        return new MedicalConditionDto_1.MedicalConditionDto(medicalCondition.code, medicalCondition.name, medicalCondition.description, medicalCondition.commonSymptoms);
    }
    static toEntity(medicalConditionDto) {
        return new MedicalCondition_1.MedicalCondition(medicalConditionDto.code, medicalConditionDto.name, medicalConditionDto.description, medicalConditionDto.commonSymptoms);
    }
    static toEntityFromCreating(CreatingMedicalConditionDto) {
        return new MedicalCondition_1.MedicalCondition(CreatingMedicalConditionDto.code, CreatingMedicalConditionDto.name, CreatingMedicalConditionDto.description, CreatingMedicalConditionDto.commonSymptoms);
    }
}
exports.MedicalConditionMap = MedicalConditionMap;
//# sourceMappingURL=MedicalConditionMap.js.map
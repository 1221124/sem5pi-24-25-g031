"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalConditionMap = void 0;
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
const CommonSyptom_1 = require("../domain/medical-condition/CommonSyptom");
const MedicalCondition_1 = require("../domain/medical-condition/MedicalCondition");
const Description_1 = require("../domain/shared/Description");
const ICD11Code_1 = require("../domain/shared/ICD11Code");
const Name_1 = require("../domain/shared/Name");
class MedicalConditionMap {
    static toDto(medicalCondition) {
        return {
            code: medicalCondition.code,
            name: medicalCondition.name,
            description: medicalCondition.description,
            commonSymptoms: medicalCondition.commonSymptoms
        };
    }
    static async toDomain(raw) {
        const codeOrError = ICD11Code_1.ICD11Code.create(raw.code);
        const nameOrError = Name_1.Name.create(raw.name);
        const descriptionOrError = Description_1.Description.create(raw.description);
        const commonSymptomsOrError = raw.commonSymptom.map((symptom) => CommonSyptom_1.CommonSymptom.create(symptom));
        const medicalConditionOrError = MedicalCondition_1.MedicalCondition.create({
            code: codeOrError.getValue(),
            name: nameOrError.getValue(),
            description: descriptionOrError.getValue(),
            commonSymptoms: commonSymptomsOrError.map((symptomOrError) => symptomOrError.getValue())
        }, new UniqueEntityID_1.UniqueEntityID(raw.medicalConditionId));
        medicalConditionOrError.isFailure ? console.log(medicalConditionOrError.error) : '';
        return medicalConditionOrError.isSuccess ? medicalConditionOrError.getValue() : null;
    }
    static toPersistence(medicalCondition) {
        return {
            medicalConditionId: medicalCondition.id.toString(),
            code: medicalCondition.code.value,
            name: medicalCondition.name.value,
            description: medicalCondition.description.value,
            commonSymptoms: medicalCondition.commonSymptoms.map(symptom => symptom.value)
        };
    }
}
exports.MedicalConditionMap = MedicalConditionMap;
//# sourceMappingURL=MedicalConditionMap.js.map
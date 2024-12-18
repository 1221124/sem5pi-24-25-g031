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
        try {
            const codeOrError = ICD11Code_1.ICD11Code.create(raw.code);
            if (codeOrError.isFailure)
                throw new Error("ICD11 code failed validation.");
            const code = codeOrError.getValue();
            console.log("code :> " + code);
            const nameOrError = Name_1.Name.create(raw.name);
            if (nameOrError.isFailure)
                throw new Error("ICD11 code failed validation.");
            const name = nameOrError.getValue();
            console.log("name :> " + name);
            const descriptionOrError = Description_1.Description.create(raw.description);
            if (descriptionOrError.isFailure)
                throw new Error("ICD11 code failed validation.");
            const description = descriptionOrError.getValue();
            console.log("description :> " + description);
            if (!Array.isArray(raw.commonSymptoms) || raw.commonSymptoms.length === 0) {
                throw new Error("Common symptoms are required.");
            }
            const commonSymptomsOrError = raw.commonSymptoms.map((symptom) => CommonSyptom_1.CommonSymptom.create(symptom));
            if (commonSymptomsOrError.some((result) => result.isFailure)) {
                throw new Error("One or more common symptoms failed validation.");
            }
            const commonSymptoms = commonSymptomsOrError.map((result) => result.getValue());
            console.log("commonSymptoms :> " + commonSymptoms);
            const medicalConditionOrError = MedicalCondition_1.MedicalCondition.create({
                code: code,
                name: name,
                description: description,
                commonSymptoms: commonSymptoms // Now plain values
            }, new UniqueEntityID_1.UniqueEntityID(raw.domainId));
            console.log("Medical condition or error: ", medicalConditionOrError);
            medicalConditionOrError.isFailure ? console.log("medicalConditionOrError" + medicalConditionOrError.error) : '';
            return medicalConditionOrError.isSuccess ? medicalConditionOrError.getValue() : null;
        }
        catch (error) {
            console.log("Error mapping to domain: ", error);
            throw error;
        }
    }
    static toPersistence(medicalCondition) {
        return {
            medicalConditionId: medicalCondition.id,
            code: medicalCondition.code.value,
            name: medicalCondition.name.value,
            description: medicalCondition.description.value,
            commonSymptoms: medicalCondition.commonSymptoms.map((symptom) => {
                console.log("symptom :> " + symptom.value);
                return symptom.value;
            }),
        };
    }
}
exports.MedicalConditionMap = MedicalConditionMap;
//# sourceMappingURL=MedicalConditionMap.js.map
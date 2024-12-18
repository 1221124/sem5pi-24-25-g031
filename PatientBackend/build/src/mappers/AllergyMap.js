"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllergyMap = void 0;
const Allergy_1 = require("../domain/allergy/Allergy");
const ICD11Code_1 = require("../domain/shared/ICD11Code");
const Name_1 = require("../domain/shared/Name");
const Description_1 = require("../domain/shared/Description");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
class AllergyMap {
    static toDto(allergy) {
        return {
            code: allergy.code,
            name: allergy.name,
            description: allergy.description
        };
    }
    static async toDomain(raw) {
        const codeOrError = ICD11Code_1.ICD11Code.create(raw.code);
        const nameOrError = Name_1.Name.create(raw.name);
        const descriptionOrError = Description_1.Description.create(raw.description);
        const allergyOrError = Allergy_1.Allergy.create({
            code: codeOrError.getValue(),
            name: nameOrError.getValue(),
            description: descriptionOrError.getValue()
        }, new UniqueEntityID_1.UniqueEntityID(raw.allergyId));
        allergyOrError.isFailure ? console.log(allergyOrError.error) : '';
        return allergyOrError.isSuccess ? allergyOrError.getValue() : null;
    }
    static toPersistence(allergy) {
        return {
            allergyId: allergy.id.toString(),
            code: allergy.code.value,
            name: allergy.name.value,
            description: allergy.description.value
        };
    }
}
exports.AllergyMap = AllergyMap;
//# sourceMappingURL=AllergyMap.js.map
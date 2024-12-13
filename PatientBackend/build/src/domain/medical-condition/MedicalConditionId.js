"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalConditionId = void 0;
const uuid_1 = require("uuid");
class MedicalConditionId {
    constructor(id) {
        if (id && !(0, uuid_1.validate)(id)) {
            throw new Error("Invalid GUID format for MedicalConditionId");
        }
        this.id = id || (0, uuid_1.v4)();
    }
    getId() {
        return this.id;
    }
    equals(other) {
        return this.id === other.id;
    }
}
exports.MedicalConditionId = MedicalConditionId;
//# sourceMappingURL=MedicalConditionId.js.map
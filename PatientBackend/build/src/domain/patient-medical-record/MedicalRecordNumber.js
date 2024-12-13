"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecordNumber = void 0;
class MedicalRecordNumber {
    constructor(value) {
        if (!value) {
            throw new Error("Medical record number cannot be null or empty");
        }
        this.value = value;
    }
    getValue() {
        return this.value;
    }
}
exports.MedicalRecordNumber = MedicalRecordNumber;
//# sourceMappingURL=MedicalRecordNumber.js.map
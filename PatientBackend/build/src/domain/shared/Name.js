"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Name = void 0;
class Name {
    constructor(value) {
        if (!value) {
            throw new Error("Name cannot be null or empty");
        }
        this.value = value;
    }
    getValue() {
        return this.value;
    }
}
exports.Name = Name;
//# sourceMappingURL=Name.js.map
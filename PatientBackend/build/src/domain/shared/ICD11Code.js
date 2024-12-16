"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICD11Code = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Guard_1 = require("../../core/logic/Guard");
const Result_1 = require("../../core/logic/Result");
class ICD11Code extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(code) {
        const guardResult = Guard_1.Guard.againstNullOrUndefined(code, 'code');
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        const icd11Code = new ICD11Code({ value: code });
        return Result_1.Result.ok(icd11Code);
    }
}
exports.ICD11Code = ICD11Code;
//# sourceMappingURL=ICD11Code.js.map
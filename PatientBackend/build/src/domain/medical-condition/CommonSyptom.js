"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonSymptom = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Guard_1 = require("../../core/logic/Guard");
const Result_1 = require("../../core/logic/Result");
class CommonSymptom extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(commonSymptom) {
        const guardResult = Guard_1.Guard.againstNullOrUndefined(commonSymptom, 'commonSymptom');
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        else {
            return Result_1.Result.ok(new CommonSymptom({ value: commonSymptom }));
        }
    }
}
exports.CommonSymptom = CommonSymptom;
//# sourceMappingURL=CommonSyptom.js.map
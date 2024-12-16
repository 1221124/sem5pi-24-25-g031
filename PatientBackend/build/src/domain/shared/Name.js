"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Name = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Guard_1 = require("../../core/logic/Guard");
const Result_1 = require("../../core/logic/Result");
class Name extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(name) {
        const guardResult = Guard_1.Guard.againstNullOrUndefined(name, 'name');
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        else {
            return Result_1.Result.ok(new Name({ value: name }));
        }
    }
}
exports.Name = Name;
//# sourceMappingURL=Name.js.map
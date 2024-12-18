"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Allergy = void 0;
const AggregateRoot_1 = require("../../core/domain/AggregateRoot");
const AllergyId_1 = require("./AllergyId");
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
class Allergy extends AggregateRoot_1.AggregateRoot {
    get id() {
        return AllergyId_1.AllergyId.caller(this.id);
    }
    get allergyId() {
        return AllergyId_1.AllergyId.caller(this.id);
    }
    get code() {
        return this.props.code;
    }
    get name() {
        return this.props.name;
    }
    get description() {
        return this.props.description;
    }
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const guardedProps = [
            { argument: props.code, argumentName: 'code' },
            { argument: props.name, argumentName: 'name' },
            { argument: props.description, argumentName: 'description' }
        ];
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        else {
            const allergy = new Allergy(Object.assign({}, props), id);
            return Result_1.Result.ok(allergy);
        }
    }
}
exports.Allergy = Allergy;
//# sourceMappingURL=Allergy.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalCondition = void 0;
const AggregateRoot_1 = require("../../core/domain/AggregateRoot");
const Guard_1 = require("../../core/logic/Guard");
const Result_1 = require("../../core/logic/Result");
const MedicalConditionId_1 = require("./MedicalConditionId");
class MedicalCondition extends AggregateRoot_1.AggregateRoot {
    get id() {
        return MedicalConditionId_1.MedicalConditionId.caller(this.id);
    }
    get medicalConditionId() {
        return MedicalConditionId_1.MedicalConditionId.caller(this.id);
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
    get commonSymptoms() {
        return this.props.commonSymptoms;
    }
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const guardedProps = [
            { argument: props.code, argumentName: 'code' },
            { argument: props.name, argumentName: 'name' },
            { argument: props.description, argumentName: 'description' },
            { argument: props.commonSymptoms, argumentName: 'commonSymptoms' }
        ];
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        else {
            const medicalCondition = new MedicalCondition(Object.assign({}, props), id);
            return Result_1.Result.ok(medicalCondition);
        }
    }
    updateFromRequest(request) {
        if (request.description !== null && request.description !== undefined) {
            this.props.description = request.description;
        }
        if (request.commonSymptoms !== null && request.commonSymptoms !== undefined) {
            this.props.commonSymptoms = request.commonSymptoms;
        }
    }
}
exports.MedicalCondition = MedicalCondition;
//# sourceMappingURL=MedicalCondition.js.map
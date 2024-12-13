"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const AggregateRoot_1 = require("../core/domain/AggregateRoot");
const Result_1 = require("../core/logic/Result");
const userId_1 = require("./userId");
const Guard_1 = require("../core/logic/Guard");
class User extends AggregateRoot_1.AggregateRoot {
    get id() {
        return this._id;
    }
    get userId() {
        return userId_1.UserId.caller(this.id);
    }
    get email() {
        return this.props.email;
    }
    get firstName() {
        return this.props.firstName;
    }
    get lastName() {
        return this.props.lastName;
    }
    get password() {
        return this.props.password;
    }
    get role() {
        return this.props.role;
    }
    set role(value) {
        this.props.role = value;
    }
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const guardedProps = [
            { argument: props.firstName, argumentName: 'firstName' },
            { argument: props.lastName, argumentName: 'lastName' },
            { argument: props.email, argumentName: 'email' },
            { argument: props.role, argumentName: 'role' }
        ];
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        else {
            const user = new User(Object.assign({}, props), id);
            return Result_1.Result.ok(user);
        }
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map
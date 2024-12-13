"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const AggregateRoot_1 = require("../core/domain/AggregateRoot");
const Result_1 = require("../core/logic/Result");
const roleId_1 = require("./roleId");
class Role extends AggregateRoot_1.AggregateRoot {
    get id() {
        return this._id;
    }
    get roleId() {
        return new roleId_1.RoleId(this.roleId.toValue());
    }
    get name() {
        return this.props.name;
    }
    set name(value) {
        this.props.name = value;
    }
    constructor(props, id) {
        super(props, id);
    }
    static create(roleDTO, id) {
        const name = roleDTO.name;
        if (!!name === false || name.length === 0) {
            return Result_1.Result.fail('Must provide a role name');
        }
        else {
            const role = new Role({ name: name }, id);
            return Result_1.Result.ok(role);
        }
    }
}
exports.Role = Role;
//# sourceMappingURL=role.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleMap = void 0;
const Mapper_1 = require("../core/infra/Mapper");
const role_1 = require("../domain/role");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
class RoleMap extends Mapper_1.Mapper {
    static toDTO(role) {
        return {
            id: role.id.toString(),
            name: role.name,
        };
    }
    static toDomain(role) {
        const roleOrError = role_1.Role.create(role, new UniqueEntityID_1.UniqueEntityID(role.domainId));
        roleOrError.isFailure ? console.log(roleOrError.error) : '';
        return roleOrError.isSuccess ? roleOrError.getValue() : null;
    }
    static toPersistence(role) {
        return {
            domainId: role.id.toString(),
            name: role.name
        };
    }
}
exports.RoleMap = RoleMap;
//# sourceMappingURL=RoleMap.js.map
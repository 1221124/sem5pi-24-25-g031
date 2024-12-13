"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const roleId_1 = require("../domain/roleId");
const RoleMap_1 = require("../mappers/RoleMap");
const mongoose_1 = require("mongoose");
let RoleRepo = class RoleRepo {
    constructor(roleSchema) {
        this.roleSchema = roleSchema;
    }
    createBaseQuery() {
        return {
            where: {},
        };
    }
    async exists(role) {
        const idX = role.id instanceof roleId_1.RoleId ? role.id.toValue() : role.id;
        const query = { domainId: idX };
        const roleDocument = await this.roleSchema.findOne(query);
        return !!roleDocument === true;
    }
    async save(role) {
        const query = { domainId: role.id.toString() };
        const roleDocument = await this.roleSchema.findOne(query);
        try {
            if (roleDocument === null) {
                const rawRole = RoleMap_1.RoleMap.toPersistence(role);
                const roleCreated = await this.roleSchema.create(rawRole);
                return RoleMap_1.RoleMap.toDomain(roleCreated);
            }
            else {
                roleDocument.name = role.name;
                await roleDocument.save();
                return role;
            }
        }
        catch (err) {
            throw err;
        }
    }
    async findByDomainId(roleId) {
        const query = { domainId: roleId };
        const roleRecord = await this.roleSchema.findOne(query);
        if (roleRecord != null) {
            return RoleMap_1.RoleMap.toDomain(roleRecord);
        }
        else
            return null;
    }
};
RoleRepo = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('roleSchema')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], RoleRepo);
exports.default = RoleRepo;
//# sourceMappingURL=roleRepo.js.map
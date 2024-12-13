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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const config_1 = __importDefault(require("../../config"));
const role_1 = require("../domain/role");
const Result_1 = require("../core/logic/Result");
const RoleMap_1 = require("../mappers/RoleMap");
let RoleService = class RoleService {
    constructor(roleRepo) {
        this.roleRepo = roleRepo;
    }
    async getRole(roleId) {
        try {
            const role = await this.roleRepo.findByDomainId(roleId);
            if (role === null) {
                return Result_1.Result.fail("Role not found");
            }
            else {
                const roleDTOResult = RoleMap_1.RoleMap.toDTO(role);
                return Result_1.Result.ok(roleDTOResult);
            }
        }
        catch (e) {
            throw e;
        }
    }
    async createRole(roleDTO) {
        try {
            const roleOrError = await role_1.Role.create(roleDTO);
            if (roleOrError.isFailure) {
                return Result_1.Result.fail(roleOrError.errorValue());
            }
            const roleResult = roleOrError.getValue();
            await this.roleRepo.save(roleResult);
            const roleDTOResult = RoleMap_1.RoleMap.toDTO(roleResult);
            return Result_1.Result.ok(roleDTOResult);
        }
        catch (e) {
            throw e;
        }
    }
    async updateRole(roleDTO) {
        try {
            const role = await this.roleRepo.findByDomainId(roleDTO.id);
            if (role === null) {
                return Result_1.Result.fail("Role not found");
            }
            else {
                role.name = roleDTO.name;
                await this.roleRepo.save(role);
                const roleDTOResult = RoleMap_1.RoleMap.toDTO(role);
                return Result_1.Result.ok(roleDTOResult);
            }
        }
        catch (e) {
            throw e;
        }
    }
};
RoleService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.repos.role.name)),
    __metadata("design:paramtypes", [Object])
], RoleService);
exports.default = RoleService;
//# sourceMappingURL=roleService.js.map
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
const Result_1 = require("../core/logic/Result");
const AllergyMap_1 = require("../mappers/AllergyMap");
let AllergyService = class AllergyService {
    constructor(allergyRepo) {
        this.allergyRepo = allergyRepo;
    }
    async createAllergy(dto) {
        try {
            const creatingAllergy = AllergyMap_1.AllergyMap.toDomain(dto);
            if (!creatingAllergy) {
                return Result_1.Result.fail(creatingAllergy);
            }
            await this.allergyRepo.save(await creatingAllergy);
            const allergyDTO = AllergyMap_1.AllergyMap.toDto(await creatingAllergy);
            return Result_1.Result.ok(allergyDTO);
        }
        catch (error) {
            return Result_1.Result.fail(error);
        }
    }
};
AllergyService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.repos.allergy.name)),
    __metadata("design:paramtypes", [Object])
], AllergyService);
exports.default = AllergyService;
//# sourceMappingURL=AllergyService.js.map
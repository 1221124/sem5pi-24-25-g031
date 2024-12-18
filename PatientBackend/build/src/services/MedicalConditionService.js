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
const MedicalConditionMap_1 = require("../mappers/MedicalConditionMap");
const Result_1 = require("../core/logic/Result");
let MedicalConditionService = class MedicalConditionService {
    constructor(medicalConditionRepo) {
        this.medicalConditionRepo = medicalConditionRepo;
    }
    /**
     * Retrieves a medical condition by its ID.
     */
    async getMedicalConditionById(id) {
        try {
            const medicalCondition = await this.medicalConditionRepo.findByDomainId(id);
            if (!medicalCondition) {
                return Result_1.Result.fail("Medical condition not found");
            }
            const medicalConditionDTO = MedicalConditionMap_1.MedicalConditionMap.toDto(medicalCondition);
            return Result_1.Result.ok(medicalConditionDTO);
        }
        catch (error) {
            throw error; // Rethrow to be handled by the controller.
        }
    }
    /**
     * Lists all medical conditions.
     */
    async getAll() {
        try {
            const medicalConditions = await this.medicalConditionRepo.findAll();
            return medicalConditions.map(MedicalConditionMap_1.MedicalConditionMap.toDto);
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Creates a new medical condition.
     */
    /**
     * Creates a new medical condition.
     */
    async createMedicalCondition(dto) {
        try {
            console.log("Creating medical condition (service): ", dto);
            const medicalConditionDto = await MedicalConditionMap_1.MedicalConditionMap.toDomain(dto);
            console.log("1 medicalConditionDto: ", medicalConditionDto);
            if (!medicalConditionDto) {
                return Result_1.Result.fail("Failed to map medical condition DTO to domain.");
            }
            console.log("2 creatingMedicalCondition: ", medicalConditionDto);
            console.log("saving medical condition");
            await this.medicalConditionRepo.save(medicalConditionDto);
            const medicalConditionDTO = MedicalConditionMap_1.MedicalConditionMap.toDto(medicalConditionDto);
            return Result_1.Result.ok(medicalConditionDTO);
        }
        catch (error) {
            console.log("Error: ", error);
            return Result_1.Result.fail(error.message);
        }
    }
    /**
     * Updates an existing medical condition by its ID.
     */
    async updateMedicalCondition(dto) {
        try {
            const medicalCondition = await this.medicalConditionRepo.findByDomainId(dto.id.toString());
            if (medicalCondition == null) {
                return Result_1.Result.fail("Medical condition not found");
            }
            // Update fields on the existing medical condition entity.
            console.log("fake update");
            //medicalCondition.updateFromRequest(dto);
            // Save the updated medical condition entity.
            await this.medicalConditionRepo.save(medicalCondition);
            const updatedMedicalConditionDTO = MedicalConditionMap_1.MedicalConditionMap.toDto(medicalCondition);
            return Result_1.Result.ok(updatedMedicalConditionDTO);
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Deletes a medical condition by its ID.
     */
    async deleteMedicalCondition(id) {
        try {
            const medicalCondition = await this.medicalConditionRepo.findByDomainId(id);
            if (!medicalCondition) {
                return Result_1.Result.fail("Medical condition not found");
            }
            await this.medicalConditionRepo.delete(medicalCondition);
            return Result_1.Result.ok();
        }
        catch (error) {
            throw error;
        }
    }
};
MedicalConditionService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.repos.medicalCondition.name)),
    __metadata("design:paramtypes", [Object])
], MedicalConditionService);
exports.default = MedicalConditionService;
//# sourceMappingURL=MedicalConditionService.js.map
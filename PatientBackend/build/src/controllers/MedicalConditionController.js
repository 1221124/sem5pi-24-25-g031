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
const MedicalConditionService_1 = __importDefault(require("../services/MedicalConditionService"));
let MedicalConditionController = class MedicalConditionController {
    constructor(medicalConditionService) {
        this.medicalConditionService = medicalConditionService;
    }
    /**
     * Handles the creation of a new medical condition.
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next middleware function.
     */
    async createMedicalCondition(req, res, next) {
        try {
            const resultOrError = await this.medicalConditionService.createMedicalCondition(req.body);
            if (resultOrError.isFailure) {
                return res.status(400).send(resultOrError.errorValue());
            }
            const medicalConditionDTO = resultOrError.getValue();
            return res.status(201).json(medicalConditionDTO);
        }
        catch (error) {
            return next(error);
        }
    }
    /**
     * Retrieves a medical condition by its ID.
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next middleware function.
     */
    async getMedicalConditionById(req, res, next) {
        try {
            const id = req.params.id;
            const resultOrError = await this.medicalConditionService.getMedicalConditionById(id);
            if (resultOrError.isFailure) {
                return res.status(404).send(resultOrError.errorValue());
            }
            const medicalConditionDTO = resultOrError.getValue();
            return res.json(medicalConditionDTO);
        }
        catch (error) {
            return next(error);
        }
    }
    /**
     * Lists all medical conditions.
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next middleware function.
     */
    async listMedicalConditions(req, res, next) {
        try {
            const medicalConditions = await this.medicalConditionService.listMedicalConditions();
            return res.json(medicalConditions);
        }
        catch (error) {
            return next(error);
        }
    }
    /**
     * Updates an existing medical condition by its ID.
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next middleware function.
     */
    async updateMedicalCondition(req, res, next) {
        try {
            const resultOrError = await this.medicalConditionService.updateMedicalCondition(req.body);
            if (resultOrError.isFailure) {
                return res.status(400).send(resultOrError.errorValue());
            }
            const updatedMedicalConditionDTO = resultOrError.getValue();
            return res.json(updatedMedicalConditionDTO);
        }
        catch (error) {
            return next(error);
        }
    }
    /**
     * Deletes a medical condition by its ID.
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next middleware function.
     */
    async deleteMedicalCondition(req, res, next) {
        try {
            const id = req.params.id; // Get the ID from the route parameters.
            const resultOrError = await this.medicalConditionService.deleteMedicalCondition(id);
            if (resultOrError.isFailure) {
                return res.status(404).send(resultOrError.errorValue());
            }
            return res.status(204).send();
        }
        catch (error) {
            return next(error);
        }
    }
};
MedicalConditionController = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.services.medicalCondition.name)),
    __metadata("design:paramtypes", [MedicalConditionService_1.default])
], MedicalConditionController);
exports.default = MedicalConditionController;
//# sourceMappingURL=MedicalConditionController.js.map
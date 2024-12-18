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
const AllergyService_1 = __importDefault(require("../services/AllergyService"));
let AllergyController = class AllergyController {
    constructor(allergyService) {
        this.allergyService = allergyService;
    }
    /**
     * Handles the creation of a new allergy.
     * @param req
     * @param res
     * @param next
     */
    async createAllergy(req, res, next) {
        try {
            const resultOrError = await this.allergyService.createAllergy(req.body);
            if (resultOrError.isFailure) {
                return res.status(400).send(resultOrError.errorValue());
            }
            const allergyDTO = resultOrError.getValue();
            return res.status(201).json(allergyDTO);
        }
        catch (error) {
            return next(error);
        }
    }
    /**
     * Retrieves all allergies.
     * @param req
     * @param res
     * @param next
     */
    async getAllAllergies(req, res, next) {
        try {
            const allergies = await this.allergyService.getAll();
            return res.json(allergies);
        }
        catch (error) {
            return next(error);
        }
    }
};
AllergyController = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.services.allergy.name)),
    __metadata("design:paramtypes", [AllergyService_1.default])
], AllergyController);
exports.default = AllergyController;
//# sourceMappingURL=AllergyController.js.map
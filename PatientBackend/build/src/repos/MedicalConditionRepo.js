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
const MedicalConditionMap_1 = require("../mappers/MedicalConditionMap");
const mongoose_1 = require("mongoose");
let MedicalConditionRepo = class MedicalConditionRepo {
    constructor(medicalConditionSchema) {
        this.medicalConditionSchema = medicalConditionSchema;
    }
    createBaseQuery() {
        return {
            where: {},
        };
    }
    /**
     * Check if a medical condition exists.
     */
    async exists(medicalCondition) {
        // const idX = medicalCondition.id instanceof MedicalConditionId ? (<MedicalConditionId>medicalCondition.id).toValue() : medicalCondition.id;
        // const query = { domainId: idX };
        // const medicalConditionDocument = await this.medicalConditionSchema.findOne(query as FilterQuery<IMedicalConditionPersistence & Document>);
        // return !!medicalConditionDocument === true;
        return false;
    }
    /**
     * Save a medical condition (create or update).
     */
    async save(medicalCondition) {
        // const query = { domainId: medicalCondition.id.toString() };
        // const medicalConditionDocument = await this.medicalConditionSchema.findOne(query);
        // try {
        //   if (medicalConditionDocument === null) {
        //     const rawMedicalCondition: any = MedicalConditionMap.toPersistence(medicalCondition);
        //     const medicalConditionCreated = await this.medicalConditionSchema.create(rawMedicalCondition);
        //     return MedicalConditionMap.toDomain(medicalConditionCreated);
        //   } else {
        //     medicalConditionDocument.name = medicalCondition.name; // Update any relevant fields
        //     await medicalConditionDocument.save();
        //     return medicalCondition;
        //   }
        // } catch (err) {
        //   throw err;
        // }
        return null;
    }
    /**
     * Find a medical condition by its domain ID.
     */
    async findByDomainId(medicalConditionId) {
        const query = { domainId: medicalConditionId };
        const medicalConditionRecord = await this.medicalConditionSchema.findOne(query);
        if (medicalConditionRecord != null) {
            return MedicalConditionMap_1.MedicalConditionMap.toDomain(medicalConditionRecord);
        }
        else {
            return null;
        }
    }
    /**
     * Find all medical conditions.
     */
    async findAll() {
        // const medicalConditions = await this.medicalConditionSchema.find();
        // return medicalConditions.map(MedicalConditionMap.toDomain);
        return [];
    }
    /**
     * Delete a medical condition by its ID.
     */
    async delete(medicalCondition) {
        const query = { domainId: medicalCondition.id.toString() };
        await this.medicalConditionSchema.deleteOne(query);
    }
};
MedicalConditionRepo = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('medicalConditionSchema')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], MedicalConditionRepo);
exports.default = MedicalConditionRepo;
//# sourceMappingURL=MedicalConditionRepo.js.map
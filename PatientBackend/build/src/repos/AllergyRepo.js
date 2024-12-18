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
const mongoose_1 = require("mongoose");
const AllergyMap_1 = require("../mappers/AllergyMap");
let AllergyRepo = class AllergyRepo {
    constructor(allergySchema) {
        this.allergySchema = allergySchema;
    }
    createBaseQuery() {
        return {
            where: {},
        };
    }
    async exists(allergy) {
        // const idX = medicalCondition.id instanceof MedicalConditionId ? (<MedicalConditionId>medicalCondition.id).toValue() : medicalCondition.id;
        // const query = { domainId: idX };
        // const medicalConditionDocument = await this.medicalConditionSchema.findOne(query as FilterQuery<IMedicalConditionPersistence & Document>);
        // return !!medicalConditionDocument === true;
        return false;
    }
    async save(allergy) {
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
    async findByDomainId(allergyId) {
        const query = { domainId: allergyId };
        const allergy = await this.allergySchema.findOne(query);
        if (allergy != null) {
            return AllergyMap_1.AllergyMap.toDomain(allergy);
        }
        else {
            return null;
        }
    }
};
AllergyRepo = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('allergySchema')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], AllergyRepo);
exports.default = AllergyRepo;
//# sourceMappingURL=AllergyRepo.js.map
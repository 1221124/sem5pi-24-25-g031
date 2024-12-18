"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("./express"));
const dependencyInjector_1 = __importDefault(require("./dependencyInjector"));
const mongoose_1 = __importDefault(require("./mongoose"));
const logger_1 = __importDefault(require("./logger"));
const config_1 = __importDefault(require("../../config"));
exports.default = async ({ expressApp }) => {
    const mongoConnection = await (0, mongoose_1.default)();
    logger_1.default.info('✌️ DB loaded and connected!');
    const userSchema = {
        // compare with the approach followed in repos and services
        name: 'userSchema',
        schema: '../persistence/schemas/userSchema',
    };
    const roleSchema = {
        // compare with the approach followed in repos and services
        name: 'roleSchema',
        schema: '../persistence/schemas/roleSchema',
    };
    const roleController = {
        name: config_1.default.controllers.role.name,
        path: config_1.default.controllers.role.path
    };
    const roleRepo = {
        name: config_1.default.repos.role.name,
        path: config_1.default.repos.role.path
    };
    const userRepo = {
        name: config_1.default.repos.user.name,
        path: config_1.default.repos.user.path
    };
    const roleService = {
        name: config_1.default.services.role.name,
        path: config_1.default.services.role.path
    };
    /*** MEDICAL CONDITION ***/
    const medicalConditionSchema = {
        name: 'medicalConditionSchema',
        schema: '../persistence/schemas/medicalConditionSchema',
    };
    const medicalConditionController = {
        name: config_1.default.controllers.medicalCondition.name,
        path: config_1.default.controllers.medicalCondition.path
    };
    const medicalConditionService = {
        name: config_1.default.services.medicalCondition.name,
        path: config_1.default.services.medicalCondition.path
    };
    const medicalConditionRepo = {
        name: config_1.default.repos.medicalCondition.name,
        path: config_1.default.repos.medicalCondition.path
    };
    /*** ALLERGY ***/
    const allergySchema = {
        name: 'allergySchema',
        schema: '../persistence/schemas/allergySchema',
    };
    const allergyController = {
        name: config_1.default.controllers.allergy.name,
        path: config_1.default.controllers.allergy.path
    };
    const allergyService = {
        name: config_1.default.services.allergy.name,
        path: config_1.default.services.allergy.path
    };
    const allergyRepo = {
        name: config_1.default.repos.allergy.name,
        path: config_1.default.repos.allergy.path
    };
    /*** DEPENDENCY INJECTOR ***/
    (0, dependencyInjector_1.default)({
        mongoConnection,
        schemas: [
            userSchema,
            roleSchema,
            medicalConditionSchema,
            allergySchema
        ],
        controllers: [
            roleController,
            medicalConditionController,
            allergyController
        ],
        repos: [
            roleRepo,
            userRepo,
            medicalConditionRepo,
            allergyRepo
        ],
        services: [
            roleService,
            medicalConditionService,
            allergyService
        ]
    });
    logger_1.default.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');
    (0, express_1.default)({ app: expressApp });
    logger_1.default.info('✌️ Express loaded');
};
//# sourceMappingURL=index.js.map
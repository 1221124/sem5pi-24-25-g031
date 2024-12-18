"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const celebrate_1 = require("celebrate");
const typedi_1 = require("typedi");
const config_1 = __importDefault(require("../../../config"));
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/medical-condition', route);
    const ctrl = typedi_1.Container.get(config_1.default.controllers.medicalCondition.name);
    if (!ctrl) {
        console.error('Controller not found! Check Typedi setup or configuration.');
        throw new Error('Controller dependency injection failed.');
    }
    console.log("Controller loaded: ", ctrl);
    route.post('', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            code: celebrate_1.Joi.string().required(),
            name: celebrate_1.Joi.string().required(),
            description: celebrate_1.Joi.string().required(),
            commonSymptoms: celebrate_1.Joi.array().items(celebrate_1.Joi.string()).required(),
        })
    }), (req, res, next) => ctrl.createMedicalCondition(req, res, next));
    route.get('', (req, res, next) => ctrl.getAllMedicalConditions(req, res, next));
};
//# sourceMappingURL=MedicalConditionRoute.js.map
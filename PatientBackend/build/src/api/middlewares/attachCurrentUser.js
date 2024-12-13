"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const config_1 = __importDefault(require("../../../config"));
/**
 * Attach user to req.user
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachCurrentUser = async (req, res, next) => {
    const Logger = typedi_1.Container.get('logger');
    try {
        const userRepo = typedi_1.Container.get(config_1.default.repos.user.name);
        if (!req.token || req.token == undefined)
            next(new Error("Token inexistente ou inválido "));
        const id = req.token.id;
        const isFound = await userRepo.exists(id);
        if (isFound)
            next();
        else
            next(new Error("Token não corresponde a qualquer utilizador do sistema"));
    }
    catch (e) {
        Logger.error('🔥 Error attaching user to req: %o', e);
        return next(e);
    }
};
exports.default = attachCurrentUser;
//# sourceMappingURL=attachCurrentUser.js.map
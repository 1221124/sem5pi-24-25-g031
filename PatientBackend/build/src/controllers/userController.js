"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const config_1 = __importDefault(require("../../config"));
const UserMap_1 = require("../mappers/UserMap");
exports.getMe = async function (req, res) {
    // NB: a arquitetura ONION não está a ser seguida aqui
    const userRepo = typedi_1.Container.get(config_1.default.repos.user.name);
    if (!req.token || req.token == undefined)
        return res.json(new Error("Token inexistente ou inválido")).status(401);
    const user = await userRepo.findById(req.token.id);
    if (!user)
        return res.json(new Error("Utilizador não registado")).status(401);
    const userDTO = UserMap_1.UserMap.toDTO(user);
    return res.json(userDTO).status(200);
};
//# sourceMappingURL=userController.js.map
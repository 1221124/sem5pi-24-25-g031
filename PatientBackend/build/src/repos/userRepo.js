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
const userId_1 = require("../domain/userId");
const UserMap_1 = require("../mappers/UserMap");
let UserRepo = class UserRepo {
    constructor(userSchema, logger) {
        this.userSchema = userSchema;
        this.logger = logger;
    }
    createBaseQuery() {
        return {
            where: {},
        };
    }
    async exists(userId) {
        const idX = userId instanceof userId_1.UserId ? userId.id.toValue() : userId;
        const query = { domainId: idX };
        const userDocument = await this.userSchema.findOne(query);
        return !!userDocument === true;
    }
    async save(user) {
        const query = { domainId: user.id.toString() };
        const userDocument = await this.userSchema.findOne(query);
        try {
            if (userDocument === null) {
                const rawUser = UserMap_1.UserMap.toPersistence(user);
                const userCreated = await this.userSchema.create(rawUser);
                return UserMap_1.UserMap.toDomain(userCreated);
            }
            else {
                userDocument.firstName = user.firstName;
                userDocument.lastName = user.lastName;
                await userDocument.save();
                return user;
            }
        }
        catch (err) {
            throw err;
        }
    }
    async findByEmail(email) {
        const query = { email: email.toString() };
        const userRecord = await this.userSchema.findOne(query);
        if (userRecord != null) {
            return UserMap_1.UserMap.toDomain(userRecord);
        }
        else
            return null;
    }
    async findById(userId) {
        const idX = userId instanceof userId_1.UserId ? userId.id.toValue() : userId;
        const query = { domainId: idX };
        const userRecord = await this.userSchema.findOne(query);
        if (userRecord != null) {
            return UserMap_1.UserMap.toDomain(userRecord);
        }
        else
            return null;
    }
};
UserRepo = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('userSchema')),
    __param(1, (0, typedi_1.Inject)('logger')),
    __metadata("design:paramtypes", [mongoose_1.Model, Object])
], UserRepo);
exports.default = UserRepo;
//# sourceMappingURL=userRepo.js.map
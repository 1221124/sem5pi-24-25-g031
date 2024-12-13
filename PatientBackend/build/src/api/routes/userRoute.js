"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../middlewares"));
const celebrate_1 = require("celebrate");
var user_controller = require('../../controllers/userController');
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/auth', route);
    route.post('/signup', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            firstName: celebrate_1.Joi.string().required(),
            lastName: celebrate_1.Joi.string().required(),
            email: celebrate_1.Joi.string().required(),
            password: celebrate_1.Joi.string().required(),
            role: celebrate_1.Joi.string().required()
        }),
    }));
    route.post('/signin', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            email: celebrate_1.Joi.string().required(),
            password: celebrate_1.Joi.string().required(),
        }),
    }));
    /**
     * @TODO Let's leave this as a place holder for now
     * The reason for a logout route could be deleting a 'push notification token'
     * so the device stops receiving push notifications after logout.
     *
     * Another use case for advance/enterprise apps, you can store a record of the jwt token
     * emitted for the session and add it to a black list.
     * It's really annoying to develop that but if you had to, please use Redis as your data store
     */
    // route.post('/logout', middlewares.isAuth, (req: Request, res: Response, next: NextFunction) => {
    //   const logger = Container.get('logger') as winston.Logger;
    //   logger.debug('Calling Sign-Out endpoint with body: %o', req.body)
    //   try {
    //     //@TODO AuthService.Logout(req.user) do some clever stuff
    //     return res.status(200).end();
    //   } catch (e) {
    //     logger.error('🔥 error %o', e);
    //     return next(e);
    //   }
    // });
    app.use('/users', route);
    route.get('/me', middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, user_controller.getMe);
};
//# sourceMappingURL=userRoute.js.map
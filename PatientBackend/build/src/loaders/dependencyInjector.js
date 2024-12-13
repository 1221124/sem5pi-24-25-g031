"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const logger_1 = __importDefault(require("./logger"));
exports.default = ({ mongoConnection, schemas, controllers, repos, services }) => {
    try {
        typedi_1.Container.set('logger', logger_1.default);
        /**
         * We are injecting the mongoose models into the DI container.
         * This is controversial but it will provide a lot of flexibility
         * at the time of writing unit tests.
         */
        schemas.forEach(m => {
            // Notice the require syntax and the '.default'
            let schema = require(m.schema).default;
            typedi_1.Container.set(m.name, schema);
        });
        repos.forEach(m => {
            let repoClass = require(m.path).default;
            let repoInstance = typedi_1.Container.get(repoClass);
            typedi_1.Container.set(m.name, repoInstance);
        });
        services.forEach(m => {
            let serviceClass = require(m.path).default;
            let serviceInstance = typedi_1.Container.get(serviceClass);
            typedi_1.Container.set(m.name, serviceInstance);
        });
        controllers.forEach(m => {
            // load the @Service() class by its path
            let controllerClass = require(m.path).default;
            // create/get the instance of the @Service() class
            let controllerInstance = typedi_1.Container.get(controllerClass);
            // rename the instance inside the container
            typedi_1.Container.set(m.name, controllerInstance);
        });
        return;
    }
    catch (e) {
        logger_1.default.error('🔥 Error on dependency injector loader: %o', e);
        throw e;
    }
};
//# sourceMappingURL=dependencyInjector.js.map
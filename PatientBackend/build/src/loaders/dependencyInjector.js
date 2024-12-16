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
            console.log("Schemas: " + m.name);
            console.log(">>>" + m.name);
            // Notice the require syntax and the '.default'
            let schema = require(m.schema).default;
            console.log(">>>" + schema);
            typedi_1.Container.set(m.name, schema);
            console.log(">>>" + typedi_1.Container.get(m.name));
        });
        repos.forEach(m => {
            console.log("Repos: " + m.name);
            console.log(">>>" + m.name);
            console.log(">>>" + m.path);
            let repoClass = require(m.path).default;
            console.log(">>>" + repoClass);
            let repoInstance = typedi_1.Container.get(repoClass);
            console.log(">>>" + repoInstance);
            typedi_1.Container.set(m.name, repoInstance);
            console.log(">>>" + typedi_1.Container.get(m.name));
        });
        services.forEach(m => {
            console.log("Services: " + m.name);
            console.log(">>>" + m.name);
            console.log(">>>" + m.path);
            let serviceClass = require(m.path).default;
            console.log(">>>" + serviceClass);
            let serviceInstance = typedi_1.Container.get(serviceClass);
            console.log(">>>" + serviceInstance);
            typedi_1.Container.set(m.name, serviceInstance);
            console.log(">>>" + typedi_1.Container.get(m.name));
        });
        controllers.forEach(m => {
            console.log("Controllers: " + m.name);
            console.log(">>>" + m.name);
            console.log(">>>" + m.path);
            // load the @Service() class by its path
            let controllerClass = require(m.path).default;
            console.log(">>>" + controllerClass);
            // create/get the instance of the @Service() class
            let controllerInstance = typedi_1.Container.get(controllerClass);
            console.log(">>>" + controllerInstance);
            // rename the instance inside the container
            typedi_1.Container.set(m.name, controllerInstance);
            console.log(">>>" + typedi_1.Container.get(m.name));
        });
        return;
    }
    catch (e) {
        logger_1.default.error('🔥 Error on dependency injector loader: %o', e);
        throw e;
    }
};
//# sourceMappingURL=dependencyInjector.js.map
import { Container } from 'typedi';
import LoggerInstance from './logger';

export default ({ mongoConnection, schemas, controllers, repos, services}: {
                    mongoConnection;
                    schemas: { name: string; schema: any }[],
                    controllers: {name: string; path: string }[],
                    repos: {name: string; path: string }[],
                    services: {name: string; path: string }[] }) => {
  try {
    Container.set('mongoConnection', mongoConnection);
    Container.set('logger', LoggerInstance);

    /**
     * We are injecting the mongoose models into the DI container.
     * This is controversial but it will provide a lot of flexibility 
     * at the time of writing unit tests.
     */
    schemas.forEach(m => {
      // console.log("Schemas: " + m.name);
      // console.log(">>>" + m.name);
      // Notice the require syntax and the '.default'
      let schema = require(m.schema).default;
      // console.log(">>>" + schema);
      Container.set(m.name, schema);
      // console.log(">>>" + Container.get(m.name));
    });
  
    repos.forEach(m => {
      // console.log("Repos: " + m.name);
      // console.log(">>>" + m.name);
      // console.log(">>>" + m.path);
      let repoClass = require(m.path).default;
      // console.log(">>>" + repoClass);
      let repoInstance = Container.get(repoClass);
      // console.log(">>>" + repoInstance);
      Container.set(m.name, repoInstance);
      // console.log(">>>" + Container.get(m.name));
    });

    services.forEach(m => {
      // console.log("Services: "  + m.name);
      // console.log(">>>" + m.name);
      // console.log(">>>" + m.path);
      let serviceClass = require(m.path).default;
      // console.log(">>>" + serviceClass);
      let serviceInstance = Container.get(serviceClass);
      // console.log(">>>" + serviceInstance);
      Container.set(m.name, serviceInstance);
      // console.log(">>>" + Container.get(m.name));
      });

    controllers.forEach(m => {
      // console.log("Controllers: "+ m.name);
      // console.log(">>>" + m.name);
      // console.log(">>>" + m.path);
      // load the @Service() class by its path
      let controllerClass = require(m.path).default;
      //console.log(">>>" + controllerClass);
      // create/get the instance of the @Service() class
      let controllerInstance = Container.get(controllerClass);
      //console.log(">>>" + controllerInstance);
      // rename the instance inside the container
      Container.set(m.name, controllerInstance);
      //console.log(">>>" + Container.get(m.name));
    });
  
    return;
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};

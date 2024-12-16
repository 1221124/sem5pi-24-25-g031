import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';
import path from 'path';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

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
    name: config.controllers.role.name,
    path: config.controllers.role.path
  }

  const roleRepo = {
    name: config.repos.role.name,
    path: config.repos.role.path
  }

  const userRepo = {
    name: config.repos.user.name,
    path: config.repos.user.path
  }

  const roleService = {
    name: config.services.role.name,
    path: config.services.role.path
  }

    /*** MEDICAL CONDITION ***/

  // const medicalConditionSchema = {
  //   name: 'medicalConditionSchema',
  //   schema: '../persistence/schemas/medicalConditionSchema',
  // };

  // const medicalConditionController = {
  //   name: config.controllers.medicalCondition.name,
  //   path: config.controllers.medicalCondition.path
  // }
  
  // const medicalConditionService = {
  //   name: config.services.medicalCondition.name,
  //   path: config.services.medicalCondition.path
  // }
  
  // const medicalConditionRepo = {
  //   name: config.repos.medicalCondition.name,
  //   path: config.repos.medicalCondition.path
  // }

    /*** DEPENDENCY INJECTOR ***/

  dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      userSchema,
      roleSchema,
      // medicalConditionSchema
    ],
    controllers: [
      roleController,
      // medicalConditionController
    ],
    repos: [
      roleRepo,
      userRepo,
      // medicalConditionRepo
    ],
    services: [
      roleService,
      // medicalConditionService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};

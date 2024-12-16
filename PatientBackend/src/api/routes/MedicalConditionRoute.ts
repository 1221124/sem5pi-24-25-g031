import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import { IMedicalConditionController } from '../../controllers/IControllers/IMedicalConditionController';

import config from "../../../config";

const route = Router();

export default (app: Router) => {
  app.use('/medical-condition', route);

  const ctrl = Container.get(config.controllers.role.name) as IMedicalConditionController;
  console.log("Controller loaded: ", ctrl)

  route.post('',
    celebrate({
      body: Joi.object({
        code: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        symptoms: Joi.array().items(Joi.string()).required(),
      })
    }),
    (req, res, next) => ctrl.createMedicalCondition(req, res, next) );
};
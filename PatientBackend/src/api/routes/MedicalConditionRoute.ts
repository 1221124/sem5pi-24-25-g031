import { RequestHandler, Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import { IMedicalConditionController } from '../../controllers/IControllers/IMedicalConditionController';

import config from "../../../config";
import isAuth from '../middlewares/isAuth';

const route = Router();

export default (app: Router) => {
  console.log("MedicalConditionRoute...");

  app.use('/medical-condition', route);

  const ctrl = Container.get(config.controllers.medicalCondition.name) as IMedicalConditionController;
  
  if (!ctrl) {
    console.error('Controller not found! Check Typedi setup or configuration.');
    throw new Error('Controller dependency injection failed.');
  }

  console.log("Controller loaded: ", ctrl)

  route.post('',
    isAuth(['Admin']) as unknown as RequestHandler,
    celebrate({
      body: Joi.object({
        code: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        commonSymptoms: Joi.array().items(Joi.string()).required(),
      })
    }),
    (req, res, next) => ctrl.createMedicalCondition(req, res, next) );

  
    route.get('',
      isAuth(['Admin','Doctor','Patient']) as unknown as RequestHandler,
       (req, res, next) => ctrl.getAllMedicalConditions(req, res, next));

    route.get('/validateCode', 
      isAuth(['Doctor']) as unknown as RequestHandler,
      celebrate({
        query: Joi.object({
          code: Joi.string().required()
        })
      }),
      
      (req, res, next) => ctrl.validateICD11Code(req, res, next)
    );

    route.put('/:id',
      celebrate({
        params: Joi.object({
          id: Joi.string().required()  
        }),
        body: Joi.object({
          description: Joi.string(),
          commonSymptoms: Joi.array().items(Joi.string()),
        })
      }),
      
      (req, res, next) => ctrl.updateMedicalCondition(req, res, next)
    );

    route.delete('/:id',
      celebrate({
      params: Joi.object({
        id: Joi.string().required()
      })
      }),
      (req, res, next) => ctrl.deleteMedicalCondition(req, res, next)
    );
};
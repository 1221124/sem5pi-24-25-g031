import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';

import config from "../../../config";
import { IPatientMedicalRecordController } from '../../controllers/IControllers/IPatientMedicalRecordController';

const route = Router();

export default (app: Router) => {
  app.use('/patient-medical-record', route);

  const ctrl = Container.get(config.controllers.patientMedicalRecord.name) as IPatientMedicalRecordController;
  
  if (!ctrl) {
    console.error('Controller not found! Check Typedi setup or configuration.');
    throw new Error('Controller dependency injection failed.');
  }

  console.log("Controller loaded: ", ctrl)

  route.post('',
    celebrate({
      body: Joi.object({
        medicalRecordNumber: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.createPatientMedicalRecord(req, res, next)
  );
  
  route.get('', (req, res, next) => ctrl.getAllPatientMedicalRecords(req, res, next));

  route.put('/:id',
    celebrate({
      params: Joi.object({
        id: Joi.string().required()  
      }),
      body: Joi.object({
        allergies: Joi.array().items(Joi.string()),
        medicalConditions: Joi.array().items(Joi.string())
      })
    }),
    
    (req, res, next) => ctrl.updatePatientMedicalRecord(req, res, next)
  );
};
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

  //Create
  route.post('',
    celebrate({
      body: Joi.object({
        medicalRecordNumber: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.createPatientMedicalRecord(req, res, next)
  );
  
  //Get all
  route.get('', (req, res, next) => ctrl.getAllPatientMedicalRecords(req, res, next));

  //Get by id
  route.get('/:id',
    celebrate({
      params: Joi.object({
        id: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.getPatientMedicalRecordById(req, res, next)
  );

  //Update
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

  //Delete
  route.delete('/:id',
    celebrate({
      params: Joi.object({
        id: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.deletePatientMedicalRecord(req, res, next)
  );
};
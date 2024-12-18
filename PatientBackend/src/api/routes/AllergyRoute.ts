import {Router} from "express";
import {celebrate, Joi} from "celebrate";

import {Container} from "typedi";
import {IAllergyController} from "../../controllers/IControllers/IAllergyController";

import config from "../../../config";

const route = Router();

export default (app: Router) => {
  app.use('/allergy', route);
  
  const ctrl = Container.get(config.controllers.allergy.name) as IAllergyController;
  console.log("Controller loaded: ", ctrl);
  
    route.post('',
        celebrate({
          body: Joi.object({
            code: Joi.string().required(),
            name: Joi.string().required(),
            description: Joi.string().required(),
          })
        }),
        (req, res, next) => ctrl.createAllergy(req, res, next) );
};
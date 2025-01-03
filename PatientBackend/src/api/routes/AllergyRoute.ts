import {RequestHandler, Router} from "express";
import {celebrate, Joi} from "celebrate";

import {Container} from "typedi";
import {IAllergyController} from "../../controllers/IControllers/IAllergyController";

import config from "../../../config";
import isAuth from "../middlewares/isAuth";

const route = Router();

export default (app: Router) => {
    app.use('/allergy', route);

    const ctrl = Container.get(config.controllers.allergy.name) as IAllergyController;
    if (!ctrl) {
        console.error('Controller not found! Check Typedi setup or configuration.');
        throw new Error('Controller dependency injection failed.');
    }
    console.log("Controller loaded: ", ctrl);

    route.post('',
        isAuth(['Admin']) as unknown as RequestHandler,
        celebrate({
            body: Joi.object({
                code: Joi.string().required(),
                name: Joi.string().required(),
                description: Joi.string().required(),
            })
        }),
        (req, res, next) => ctrl.createAllergy(req, res, next) );

    route.get('', (req, res, next) => ctrl.getAllAllergies(req, res, next));

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
            })
        }),
        (req, res, next) => ctrl.updateAllergy(req, res, next)
    );

    route.delete('/:id',
        celebrate({
            params: Joi.object({
                id: Joi.string().required()
            })
        }),
        (req, res, next) => ctrl.deleteAllergy(req, res, next)
    );
};
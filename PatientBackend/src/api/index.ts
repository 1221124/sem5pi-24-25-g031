import { Router } from 'express';
import auth from './routes/userRoute';
import user from './routes/userRoute';
import role from './routes/roleRoute';
import medicalCondition from './routes/MedicalConditionRoute';
import allergy from './routes/AllergyRoute';

export default () => {
	const app = Router();

	auth(app);
	user(app);
	role(app);
	medicalCondition(app);
	allergy(app);

	app.stack?.forEach((middleware) => {
		if (middleware.route) {
			console.log(middleware.route);
		}
	});
	
	
	return app
}
import { Router } from 'express';
import MessengerController from './app/controllers/MessengerController';

const routes = new Router();

routes.group('/messages', router => {
  router.get('/', MessengerController.checkToken);
  router.post('/', MessengerController.index);
});

export default routes;

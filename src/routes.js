import { Router } from 'express';
import IndexController from './app/controllers/IndexController';
import MessengerController from './app/controllers/MessengerController';

const routes = new Router();

routes.get('/', IndexController.index);

routes.group('/messages', router => {
  router.get('/', MessengerController.checkToken);
  router.post('/', MessengerController.index);
});

export default routes;

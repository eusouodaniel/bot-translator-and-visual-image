import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import bodyParser from 'body-parser';
import 'express-group-routes';
import routes from './routes';
import sentryConfig from './config/sentry';

class App {
  constructor() {
    this.server = express();
    Sentry.init(sentryConfig);

    this.body();
    this.middlewares();
    this.routes();
    // this.exception();
  }

  body() {
    this.server.use(bodyParser.json());
    this.server.use(bodyParser.urlencoded({ extended: false }));
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exception() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.APP_ENV === 'local') {
        const errors = await new Youch(err, req).toJSON();
        return res.json(errors);
      }

      return res.sendStatus(500).json({ error: 'Internal error' });
    });
  }
}

export default new App().server;

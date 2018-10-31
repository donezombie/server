import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import session from 'express-session';
import { errorHandler as queryErrorHandler } from 'querymen';
import { errorHandler as bodyErrorHandler } from 'bodymen';
import { env, sessionSecret } from '../../config';

export default (apiRoot, routes) => {
  const app = express();

  app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7*24*60*60*1000, httpOnly: false }
  }))

  /* istanbul ignore next */
  if (env === 'production' || env === 'development') {
    app.use(cors({ origin: [ 'https://tk-lms-demovideo.herokuapp.com', 'http://10.10.2.114:3000', 'http://192.168.146.1:3000', 'https://tk-lms-std.herokuapp.com', 'https://learn.techkids.vn', 'http://learn.techkids.vn', 'http://localhost:8080', 'http://localhost:3000', 'http://localhost:3001', 'https://lms-webapp.herokuapp.com', 'http://localhost'], credentials: true }))
    app.use(compression())
    app.use(morgan('dev'))
  }

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(apiRoot, routes)
  app.use(queryErrorHandler())
  app.use(bodyErrorHandler())

  return app
}

import path from 'path';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import axios from 'axios';

import { logger } from './util';
import $ from './constants';
import E from './errors';
import Module from './module';

const BASE_URL = 'https://api.telegram.org/';

class TelegramBot {
  constructor (token, chatId, userId, type=$.BOT.AUTH_CHAT_ID) {
    this._token = token;
    this._chatId = chatId;
    this._userId = userId;
    this._authType = type;
    this._modules = [];
    this._messageHooks = new Map();

    this._app = null;

    if (!token) {
      throw E.NEED_TOKEN;
    }

    if (!chatId) {
      throw E.NEED_CHAT_ID;
    }

    if (type === $.BOT.AUTH_CHAT_ID_WITH_USER && !userId) {
      throw E.NEED_USER_ID;
    }

    this._init();
  }

  _init () {
    logger.info('Server initializing..');
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

    const app = express();
    app.use(session({
      secret: Math.random().toString(36).substring(2),
      resave: false,
      saveUninitialized: true
    }));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false}));

    app.use('*', (_, res, next) => {
      res.bot = this;

      const afterResponse = () => {
        res.removeListener('finish', afterResponse);
        res.removeListener('close', afterResponse);

        const url = res.req.originalUrl;
        const method = res.req.method;
        let sStatusCode = res.statusCode.toString();
        let logType = logger.info;

        switch (sStatusCode.charAt(0)) {
          case '2':
            sStatusCode = sStatusCode.green;
            break;

          case '3':
            sStatusCode = sStatusCode.yellow;
            break;

          case '4':
          case '5':
            sStatusCode = sStatusCode.red;
            logType = logger.error;
            break;
        }

        logType(`${method} ${sStatusCode} ${url}`);
      };

      res.on('finish', afterResponse);
      res.on('close', afterResponse);
      next();
    });

    app.post('/', (req, res) => {
      const target = this._messageHooks.get('test');
      if (target) {
        target(req, res);
      } else {
        logger.warning('test', 'Message hooks not found');
        this.sendMessage('test', 'Message hooks not found');
      }
    });

    this._app = app;
  }

  _hook (url, config, cb) {
    if (typeof config === 'function') {
      cb = config;
      config = {};
    }

    const { method } = config;
    this._app[(method || 'GET').toLowerCase()](url, cb);
    logger.info('Hook added:', url);
  }

  _messageHook (command, cb) {
    if (this._messageHooks.has(command)) {
      logger.warning('Duplicated message hook:', command);
    }

    this._messageHooks.set(command, cb);
    logger.info('Message hook added:', command);
  }

  load (...modules) {
    Array.isArray(modules[0]) && (modules = modules[0]);

    modules.forEach(m => {
      m._init({ logger });
      m.register({
        hook: this._hook.bind(this),
        messageHook: this._messageHook.bind(this)
      });
    });

    this._modules = modules;
    return this;
  }

  sendMessage (message) {
    const apiUrl = BASE_URL + path.join('bot' + this._token, 'sendMessage');
    const reqUrl = apiUrl + '?chat_id=' + this._chatId + '&text=' + message;
    logger.info('sendMessage', message);
    return axios.get(reqUrl).catch(e => {
      logger.error(e);
    });
  }

  start ({ port }) {
    return new Promise(resolve => {
      this._app.listen(port || 8080, () => {
        logger.success('Server started');
        resolve();
      });
    });
  }
}

TelegramBot.Module = Module;

export default TelegramBot;
export { $ };

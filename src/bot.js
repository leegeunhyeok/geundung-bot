import path from 'path';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import axios from 'axios';

import { logger, oc } from './util';
import $ from './constants';
import E from './errors';
import Module from './module';

const BASE_URL = 'https://api.telegram.org/';

class TelegramBot {
  constructor (proxy, token, chatId, userId, type=$.BOT.AUTH_CHAT_ID) {
    this._proxy = proxy;
    this._token = token;
    this._chatId = chatId;
    this._userId = userId;
    this._authType = type;
    this._modules = [];
    this._hooks = new Map();
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

    app.use('*', (req, res, next) => {
      res.bot = this;
      req.axios = axios;

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

    app.post(this._proxy || '/', (req, res) => {
      const username = oc(req.body, 'message', 'from', 'username');
      const message = oc(req.body, 'message', 'text') || '';
      let target = null;

      if (message.charAt(0) === '/') {
        const args = message.split(' ');
        target = this._messageHooks.get(args[0]);
        req.isCommend = true;
        req.args = args.slice(1);
      } else {
        target = this._messageHooks.get(message);
        req.isCommend = false;
        req.args = [];
      }

      if (username) {
        logger.info(`'${message}' Recived from ${username.bgBlue.white}`);
      }

      if (target) {
        target(req, res);
      } else {
        logger.warning(message, 'Message hooks not found');
        this.sendMessage(message, 'Message hooks not found');
      }
      res.end();
    });

    this._app = app;
  }

  _hook (url, config, cb) {
    if (typeof config === 'function') {
      cb = config;
      config = {};
    }

    const method = (config.method || 'GET').toLowerCase();
    if (this._hooks.has(method + url)) {
      logger.warning('Duplicated hook hook:', method, url.red);
    }

    this._app[method](this._proxy + url, cb);
    logger.info(' Hook '.bgBlue.white, 'added:', url.magenta);
  }

  _messageHook (command, cb) {
    if (this._messageHooks.has(command)) {
      logger.warning('Duplicated message hook:', command.red);
    }

    this._messageHooks.set(command, cb);
    logger.info(' Message hook '.bgBlue.white, 'added:', command.magenta);
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
    if (!message) {
      logger.warning('You can not send empty message');
      return;
    }

    const apiUrl = BASE_URL + path.join('bot' + this._token, 'sendMessage');
    const reqUrl = apiUrl + '?chat_id=' + this._chatId + '&text=' + message;
    logger.info(' sendMessage '.bgBlue.white, message);
    return axios.get(encodeURI(reqUrl).replace('#', '%23')).catch(e => {
      logger.error('sendMessage:', e.message);
    });
  }

  start ({ port }) {
    return new Promise(resolve => {
      const p = port || 8080;
      this._app.listen(p, () => {
        logger.success('Telegram bot started at', p.toString().blue, 'port');
        resolve();
      });
    });
  }
}

TelegramBot.Module = Module;

export default TelegramBot;
export { $ };

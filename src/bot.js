import path from 'path';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import axios from 'axios';

import $ from './constants';
import E from './errors';
import Module from './module';

const BASE_URL = 'https://api.telegram.org';

class TelegramBot {
  constructor (token, chatId, userId, type=$.BOT.AUTH_CHAT_ID) {
    this._token = token;
    this._chatId = chatId;
    this._userId = userId;
    this._authType = type;
    this._modules = [];
    this._messageHooks = [];

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
      next();
    });

    app.post('/', (req, res) => {
      for (const h of this._messageHooks) {
        if (h.command === 'test') {
          h.cb(req, res);
          break;
        }
      }
    });

    this._app = app;
  }

  _hook (url, cb) {
    this._app.all(url, cb);
  }

  _messageHook (command, cb) {
    this._messageHooks.push({
      command, cb
    });
  }

  load (...modules) {
    Array.isArray(modules[0]) && (modules = modules[0]);

    modules.forEach(m => {
      m.register({
        hook: this._hook.bind(this),
        messageHook: this._messageHook.bind(this)
      });
    });

    this._modules = modules;
    return this;
  }

  sendMessage (message) {
    const apiUrl = path.join(BASE_URL, 'bot' + this._token, 'sendMessage');
    const reqUrl = apiUrl + '?chat_id=' + this.chatId + '&text=' + message;
    return axios.get(reqUrl).catch(e => {
      console.error(e);
    });
  }

  start ({ port }) {
    return new Promise(resolve => {
      this._app.listen(port || 8080, () => {
        resolve();
      });
    });
  }
}

TelegramBot.Module = Module;

export default TelegramBot;
export { $ };

import TelegramBot, { $ } from './src/bot';

import GithubModule from './modules/github';

import config from 'config';

const TOKEN = config.get('TOKEN');
const CHAT_ID = config.get('CHAT_ID');
const USER_ID = config.has('USER_ID') ?
                config.get('USER_ID') :
                '';

const bot = new TelegramBot(TOKEN, CHAT_ID, USER_ID, $.API.SEND_MESSAGE);
bot
  .load([
    new GithubModule()
  ])
  .start({ port: 8080 });

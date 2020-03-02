import TelegramBot, { $ } from './src/bot';

import GithubModule from './modules/github';
import SimpleStorageModule from './modules/simpleStorage';
import config from 'config';

const PROXY = config.has('PROXY') ?
              config.get('PROXY') :
              '';
const PORT = config.get('PORT');

const TOKEN = config.get('TOKEN');
const CHAT_ID = config.get('CHAT_ID');
const USER_ID = config.has('USER_ID') ?
                config.get('USER_ID') :
                '';

const GITHUB_USERNAME = config.get('GITHUB_USERNAME');

const bot = new TelegramBot(PROXY, TOKEN, CHAT_ID, USER_ID, $.API.SEND_MESSAGE);
bot
  .load([
    new GithubModule({ username: GITHUB_USERNAME }),
    new SimpleStorageModule()
  ])
  .start({ port: PORT });

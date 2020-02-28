import TelegramBot from '../src/bot';

export default class GithubModule extends TelegramBot.Module {
  constructor (config) {
    super(config);
  }

  register ({ hook, messageHook }) {
    hook ('/api', (req, res) => {
      res.bot.sendMessage('test');
    });

    messageHook ('test', (req, res) => {
      res.bot.sendMessage('recived!!');
    });
  }
}

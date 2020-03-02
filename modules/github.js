import TelegramBot from '../src/bot';

export default class GithubModule extends TelegramBot.Module {
  constructor (config) {
    super(config);
  }

  register ({ hook, messageHook }) {
    hook ('/github', { method: 'POST' }, (req, res) => {
      console.log(req.headers);
      res.bot.sendMessage('hello');
    });

    messageHook ('/gh-hooks', (req, res) => {
      res.bot.sendMessage('Hooks');
    });
  }
}

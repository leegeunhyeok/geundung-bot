import TelegramBot from '../src/bot';

export default class SimpleStorageModule extends TelegramBot.Module {
  constructor (config) {
    super(config);
    this._storage = new Map();
  }

  register ({ messageHook }) {
    messageHook ('/ss', (req, res) => {
      let message = '';
      switch (req.args[0]) {
        case 'list':
          message = this.getList();
          break;

        case 'put':
          message = this.putItem(req.args[1], req.args[2]);
          break;

        case 'delete':
          message = this.deleteItem(req.args[1]);
          break;

        case 'clear':
          message = this.clear();
          break;

        default:
          message = 'usage: /ss [action] [key] [value]';
          break;
      }

      res.bot.sendMessage(message);
    });
  }

  getList () {
    let res = '';
    let i = 1;
    for (let [k, v] of this._storage) {
      res += `#${i++} - [${k}] ${v}\n`;
    }
    return res + '\nTotal: ' + this._storage.size;
  }

  putItem (k, v) {
    if (!k || !v) {
      return 'Need key-value fair';
    }

    this._storage.set(k, v);
    return k + ' added';
  }

  deleteItem (k) {
    if (!k) {
      return 'Need target item key';
    }

    this._storage.delete(k);
    return k + ' deleted';
  }

  clear () {
    this._storage.clear();
  }
}

import E from './errors';

class BotModule {
  constructor (config = {}) {
    this._config = config;
    this.$ = config.constants;
  }

  register () {
    throw new E.CORE.NOT_IMPLEMENTED();
  }

  messageHook () {
    throw new E.CORE.NOT_IMPLEMENTED();
  }
}

export default BotModule;

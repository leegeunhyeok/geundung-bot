import E from './errors';

class BotModule {
  constructor (config = {}) {
    this.config = config;
    this.$ = config.constants;
    this.logger = null;
  }

  _init ({ logger }) {
    this.logger = logger;
    logger.info(` ${this.constructor.name} `.bgYellow.black, 'initializing..');
  }

  register () {
    throw E.CORE.NOT_IMPLEMENTED;
  }

  messageHook () {
    throw E.CORE.NOT_IMPLEMENTED;
  }
}

export default BotModule;

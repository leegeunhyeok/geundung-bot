class UnImplementedError extends Error {
  constructor () {
    super();
  }
}

export default {
  CORE: {
    NOT_IMPLEMENTED: new UnImplementedError('You must implement this method')
  },
  NEED_TOKEN: new Error('TOKEN is required'),
  NEED_CHAT_ID: new Error('CHAT_ID is required'),
  NEED_USER_ID: new Error('AUTH_CHAT_ID_WITH_USER option need USER_ID')
};

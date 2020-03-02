import logger from './logger';

const oc = (o, ...args) => {
  let v = o;
  for (let k of args) {
    v = o[k];
    if (v === undefined) {
      return undefined;
    }
  }
  return v;
};

export { logger, oc };

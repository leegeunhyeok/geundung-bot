import logger from './logger';

const oc = (o, ...args) => {
  let v = Object.assign({}, o);
  for (let k of args) {
    v = v[k];
    if (v === undefined) {
      return undefined;
    }
  }
  return v;
};

export { logger, oc };

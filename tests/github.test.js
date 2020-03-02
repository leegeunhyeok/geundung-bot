import GithubModule, { EVENTS } from '../modules/github';
import { oc } from '../src/util';

import mock from './mock';

describe('Github Module Tests', () => {
  test('Get user id from event data', () => {
    const key = new Map(EVENTS).get('fork').refs[0].key;
    const res = oc(mock.fork, ...key.split('.'));
    expect(res).toBe('Octocoders');
  });

  test('Create \'fork\' event message', () => {
    const m = new GithubModule();
    const res = m.createMessage('fork', mock.fork);
    console.log(res);
    expect(res).toBeTruthy();
  });

  test('Create \'release\' event message', () => {
    const m = new GithubModule();
    const res = m.createMessage('release', mock.release);
    console.log(res);
    expect(res).toBeTruthy();
  });

  test('Create \'push\' event message', () => {
    const m = new GithubModule();
    const res = m.createMessage('push', mock.push);
    console.log(res);
    expect(res).toBeTruthy();
  });
});

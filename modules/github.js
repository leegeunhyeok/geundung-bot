import TelegramBot from '../src/bot';
import { oc } from '../src/util';

// https://developer.github.com/webhooks
const EVENTS = [
  ['ping', {
    name: 'Ping',
    format: '✅ Webhook ping recived'
  }],
  ['commit_comment', {
    name: 'Commented on commit',
    refs: [
      { key: 'comment.html_url' },
      { key: 'comment.user.login' },
      { key: 'comment.created_at' },
      { key: 'comment.body' },
      { key: 'repository.full_name' }
    ],
    format: '[{repository.full_name}] \'{comment.user.login}\' ' +
            'commented 💬\n\n' +
            '{comment.body}\n\n' +
            '🕒 Created at {comment.created_at}' +
            '🌎 {comment.html_url}'
  }],
  ['create', {
    name: 'Branch/Tag created',
    refs: [
      { key: 'ref_type' },
      { key: 'ref' }
    ],
    format: '({ref_type}) {ref} was created 🔖'
  }],
  ['delete', {
    name: 'Branch/Tag deleted',
    refs: [
      { key: 'ref_type' },
      { key: 'ref' }
    ],
    format: '({ref_type}) {ref} was deleted 🔖'
  }],
  ['fork', {
    name: 'Repository forked',
    refs: [
      { key: 'forkee.owner.login' },
      { key: 'forkee.full_name' },
      { key: 'forkee.html_url' },
      { key: 'repository.full_name' }
    ],
    format: '[{repository.full_name}] \'{forkee.owner.login}\' ' +
            'forked to [{forkee.full_name}] 🍴\n\n' +
            '🌎 {forkee.html_url}'
  }],
  ['gist', {
    name: 'Gist',
    refs: [
      { key: 'action' },
      { key: 'gist.html_url' },
      { key: 'gist.created_at' },
      { key: 'gist.updated_at' }
    ],
    format: '📝 Gist {action}d\n\n' +
            '🕒 Created at {gist.created_at}\n' +
            '🕒 Created at {gist.updated_at}\n\n' +
            '🌎 {gist.html_url}'
  }],
  ['issue_comment', {
    name: 'Issue comment',
    refs: [
      { key: 'action' },
      { key: 'issue.title' },
      { key: 'issue.number' },
      { key: 'issue.state' },
      { key: 'comment.html_url' },
      { key: 'comment.user.login' },
      { key: 'comment.body' },
      { key: 'comment.created_at' },
      { key: 'comment.updated_at' },
      { key: 'repository.full_name' }
    ],
    format: '[{repository.full_name}] ' +
            '{issue.title} #{issue.number} ({issue.state}) 🔥\n' +
            '👤 Issue comment {action} by \'{comment.user.login}\'\n\n' +
            '{comment.body}\n\n' +
            '🕒 Created at {comment.created_at}\n' +
            '🕒 Updated at {comment.updated_at}\n\n' +
            '🌎 {comment.html_url}'
  }],
  ['issues', {
    name: 'Issue',
    refs: [
      { key: 'action' },
      { key: 'issue.title' },
      { key: 'issue.number' },
      { key: 'issue.html_url' },
      { key: 'repository.full_name' }
    ],
    format: '[{repository.full_name}] ' +
            '{issue.title} #{issue.number} ({action}) 🔥\n\n' +
            '🌎 {issue.html_url}'
  }],
  ['public', {
    name: 'Set to public',
    refs: [
      { key: 'repository.full_name' }
    ],
    format: '[{repository.full_name}] is now public repository'
  }],
  ['pull_request', {
    name: 'Pull request',
    refs: [
      { key: 'action' },
      { key: 'number' },
      { key: 'pull_request.html_url' },
      { key: 'pull_request.state' },
      { key: 'pull_request.title' },
      { key: 'pull_request.body' },
      { key: 'pull_request.user.login' },
      { key: 'pull_request.created_at' },
      { key: 'pull_request.updated_at' },
      { key: 'repository.full_name' }
    ],
    format: '✨ Pull Request ✨\n' +
            '[{repository.full_name}] ' +
            '{pull_request.title} #{number} ({pull_request.state})\n' +
            '👤 Pull request {action} by \'{pull_request.user.login}\'\n\n' +
            '{pull_request.body}\n\n' +
            '🕒 Created at {pull_request.created_at}\n' +
            '🕒 Updated at {pull_request.updated_at}\n\n' +
            '🌎 {pull_request.html_url}'
  }],
  ['pull_request_review', {
    name: 'Pull request review',
    refs: [
      { key: 'action' },
      { key: 'review.user.login' },
      { key: 'review.html_url' },
      { key: 'pull_request.title' },
      { key: 'pull_request.number' },
      { key: 'pull_request.state' },
      { key: 'repository.full_name' }
    ],
    format: '✨ Pull Request ✨\n' +
            '[{repository.full_name}] ' +
            '{pull_request.title} #{number} ({pull_request.state})\n' +
            '👤 Pull request review {action} by ' +
            '\'{pull_request.user.login}\'\n\n' +
            '🌎 {pull_request.html_url}'
  }],
  ['pull_request_review_comment', {
    name: 'Pull request review comment',
    refs: [
      { key: 'action' },
      { key: 'comment.user.login' },
      { key: 'comment.html_url' },
      { key: 'comment.body' },
      { key: 'comment.created_at' },
      { key: 'comment.updated_at' },
      { key: 'pull_request.title' },
      { key: 'pull_request.number' },
      { key: 'pull_request.state' },
      { key: 'repository.full_name' }
    ],
    format: '✨ Pull Request ✨\n' +
            '[{repository.full_name}] ' +
            '{pull_request.title} #{pull_request.number} ' +
            '({pull_request.state})\n' +
            '👤 Pull request comment {action} by ' +
            '\'{comment.user.login}\'\n\n' +
            '{comment.body}\n\n' +
            '🕒 Created at {comment.created_at}\n' +
            '🕒 Updated at {comment.updated_at}\n\n' +
            '🌎 {comment.html_url}'
  }],
  ['push', {
    name: 'Push',
    refs: [
      { key: 'ref' },
      { key: 'pusher.name' },
      { key: 'pusher.email' },
      { key: 'commits', process: {
        type: 'map',
        refs: [
          { key: 'sha', process: {
            type: 'slice',
            start: 0,
            end: 6
          }},
          { key: 'commit.message' },
          { key: 'commit.committer.name' },
          { key: 'commit.committer.date' }
        ],
        format: '{sha} - {commit.message} ({commit.committer.date}) ' +
                '<{commit.committer.name}>\n'
      }},
      { key: 'repository.full_name' }
    ],
    format: '[{repository.full_name}] Push {ref}\n\n' +
            '📜 Commits\n' +
            '{commits}\n' +
            '👤 Push by {pusher.name} <{pusher.email}>'
  }],
  ['release', {
    name: 'Release',
    refs: [
      { key: 'action' },
      { key: 'release.html_url' },
      { key: 'release.tag_name' },
      { key: 'release.author.login' },
      { key: 'release.prerelease', process: {
        type: 'bool',
        o: ' (Pre)',
        x: ''
      }},
      { key: 'release.created_at' },
      { key: 'release.published_at' },
      { key: 'release.body' },
      { key: 'repository.full_name' }
    ],
    format: '[{repository.full_name}] Release {release.tag_name}' +
            '{release.prerelease}\n' +
            '🎉 Release {action} by {release.author.login}\n\n' +
            '{release.body}\n\n' +
            '🕒 Created at {release.created_at}\n' +
            '🕒 Published at at {release.published_at}\n\n' +
            '🌎 {release.html_url}'
  }],
  ['star', {
    name: 'Star',
    refs: [
      { key: 'action' },
      { key: 'starred_at' },
      { key: 'repository.full_name' },
      { key: 'repository.stargazers_count' },
      { key: 'repository.watchers_count' },
      { key: 'repository.html_url' },
      { key: 'sender.login' }
    ],
    format: '[{repository.full_name}] Star\n' +
            '🌟 Star {action} by {sender.login}\n\n' +
            '🕒 Starred at {starred_at}\n\n' +
            '⭐ Star(s): {repository.stargazers_count}\n' +
            '👀 Watcher(s): {repository.watchers_count}\n\n' +
            '🌎 {repository.html_url}'
  }],
  ['watch', {
    name: 'Watch',
    refs: [
      { key: 'action' },
      { key: 'repository.full_name' },
      { key: 'repository.stargazers_count' },
      { key: 'repository.watchers_count' },
      { key: 'repository.html_url' },
      { key: 'sender.login' }
    ],
    format: '[{repository.full_name}] Watch\n' +
            '👋 Watch {action} by {sender.login}\n\n' +
            '⭐ Star(s): {repository.stargazers_count}\n' +
            '👀 Watcher(s): {repository.watchers_count}\n\n' +
            '🌎 {repository.html_url}'
  }]
];

const PROCESSES = {
  bool (v, { o, x }) {
    return v ? o : x;
  },
  map (iter, { refs, format }) {
    let res = '';

    for (let v of iter) {
      const vMap = new Map();
      let commitMessage = format;

      for (let { key, process } of refs) {
        let value = oc(v, ...key.split('.'));
        if (process) {
          value = this._processes[process.type](value, process);
        }
        vMap.set(key, value);
      }

      for (let [k, v] of vMap) {
        commitMessage = commitMessage.replace(`{${k}}`, this._empty(v));
      }
      res += commitMessage;
    }

    return res;
  },
  slice (s, { start, end }) {
    return s.slice(start, end);
  }
};

export { EVENTS, PROCESSES };
export default class GithubModule extends TelegramBot.Module {
  constructor (config) {
    super(config);
    this._events = new Map(EVENTS);
    this._processes = Object.keys(PROCESSES).reduce((prev, k) => {
      prev[k] = PROCESSES[k].bind(this);
      return prev;
    }, {});
  }

  _empty (v, defaultValue='') {
    return v === undefined || v === null ?
          defaultValue :
           v;
  }

  _parse (body, { refs, format }) {
    const vMap = new Map();
    for (const { key, process } of refs) {
      let value = oc(body, ...key.split('.'));
      if (process) {
        value = this._processes[process.type](value, process);
      }
      vMap.set(key, value);
    }

    for (let [k, v] of vMap) {
      format = format.replace(`{${k}}`, this._empty(v));
    }
    return format;
  }

  createMessage (event, body) {
    if (!this._events.has(event)) {
      return `'${event}' event not defined in module`;
    }

    const config = this._events.get(event);
    this.logger(`'${config.name}' event triggered`);
    return this._parse(body, config);
  }

  register ({ hook, messageHook }) {
    hook ('/github', { method: 'POST' }, (req, res) => {
      const event = req.headers['x-github-event'];
      res.bot.sendMessage(this.createMessage(event, req.body));
      res.end();
    });

    messageHook ('/repos', (req, res) => {
      this.getRecentRepos(req, res);
    });
  }

  getRecentRepos (req, res) {
    req.axios.get(
      `https://api.github.com/users/${this.config.username}/repos?sort=updated`
    )
      .then(({ data }) => {
        const message = data.slice(0, 5).reduce((prev, curr) => {
          prev += `[${curr.full_name}]\n` +
                  `${this._empty(curr.description)}\n` +
                  `(S:${curr.stargazers_count}/W:${curr.watchers_count})\n` +
                  `${this._empty(curr.html_url)}\n\n`;
          return prev;
        }, `${this.config.username}'s recent updated 6 repositories\n\n`);
        res.bot.sendMessage(message);
      })
      .catch(e => {
        this.logger.error(e.message);
      })
      .finally(() => {
        res.end();
      });
  }
}

'use strict';var _normalize_path_sep;











function _load_normalize_path_sep() {return _normalize_path_sep = _interopRequireDefault(require('../lib/normalize_path_sep'));}var _path;
function _load_path() {return _path = _interopRequireDefault(require('path'));}var _fbWatchman;
function _load_fbWatchman() {return _fbWatchman = _interopRequireDefault(require('fb-watchman'));}var _constants;
function _load_constants() {return _constants = _interopRequireDefault(require('../constants'));}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /**
                                                                                                                                                                                                * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                                                                                                                                                                *
                                                                                                                                                                                                * This source code is licensed under the MIT license found in the
                                                                                                                                                                                                * LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                *
                                                                                                                                                                                                * 
                                                                                                                                                                                                */const watchmanURL = 'https://facebook.github.io/watchman/docs/troubleshooting.html';function isDescendant(root, child) {return child.startsWith(root);}

function WatchmanError(error) {
  return new Error(
  `Watchman error: ${error.message.trim()}. Make sure watchman ` +
  `is running for this project. See ${watchmanURL}.`);

}

module.exports = function watchmanCrawl(
options)
{const
  data = options.data,extensions = options.extensions,ignore = options.ignore,roots = options.roots;

  return new Promise((resolve, reject) => {
    const client = new (_fbWatchman || _load_fbWatchman()).default.Client();
    client.on('error', error => reject(error));

    const cmd = args =>
    new Promise((resolve, reject) => {
      client.command(args, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    const clocks = data.clocks;
    let files = data.files;

    return Promise.all(roots.map(root => cmd(['watch-project', root]))).
    then(responses => {
      const watchmanRoots = Array.from(
      new Set(responses.map(response => response.watch)));

      return Promise.all(
      watchmanRoots.map(root => {
        // Build an expression to filter the output by the relevant roots.
        const dirExpr = ['anyof'];
        roots.forEach(subRoot => {
          if (isDescendant(root, subRoot)) {
            dirExpr.push(['dirname', (_path || _load_path()).default.relative(root, subRoot)]);
          }
        });
        const expression = [
        'allof',
        ['type', 'f'],
        ['anyof'].concat(
        extensions.map(extension => ['suffix', extension]))];


        if (dirExpr.length > 1) {
          expression.push(dirExpr);
        }
        const fields = ['name', 'exists', 'mtime_ms'];

        const query = clocks[root] ?
        // Use the `since` generator if we have a clock available
        { expression, fields, since: clocks[root] } :
        // Otherwise use the `suffix` generator
        { expression, fields, suffix: extensions };
        return cmd(['query', root, query]).then(response => ({
          response,
          root }));

      })).
      then(pairs => {
        // Reset the file map if watchman was restarted and sends us a list of
        // files.
        if (pairs.some(pair => pair.response.is_fresh_instance)) {
          files = Object.create(null);
        }

        pairs.forEach(pair => {
          const root = (0, (_normalize_path_sep || _load_normalize_path_sep()).default)(pair.root);
          const response = pair.response;
          if ('warning' in response) {
            console.warn('watchman warning: ', response.warning);
          }

          clocks[root] = response.clock;
          response.files.forEach(fileData => {
            const name = root + (_path || _load_path()).default.sep + (0, (_normalize_path_sep || _load_normalize_path_sep()).default)(fileData.name);
            if (!fileData.exists) {
              delete files[name];
            } else if (!ignore(name)) {
              const mtime =
              typeof fileData.mtime_ms === 'number' ?
              fileData.mtime_ms :
              fileData.mtime_ms.toNumber();
              const isNew =
              !data.files[name] || data.files[name][(_constants || _load_constants()).default.MTIME] !== mtime;
              if (isNew) {
                // See ../constants.js
                files[name] = ['', mtime, 0, []];
              } else {
                files[name] = data.files[name];
              }
            }
          });
        });
      });
    }).
    then(() => {
      client.end();
      data.files = files;
      resolve(data);
    }).
    catch(error => {
      client.end();
      reject(WatchmanError(error));
    });
  });
};
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var Request = (function () {
  function Request(apiRoot) {
    var _this = this;

    _classCallCheck(this, Request);

    ['get', 'post', 'put', 'patch', 'del'].map(function (method) {
      _this[method] = function (path, options) {
        return new Promise(function (resolve, reject) {
          var request = _superagent2['default'][method](_this.formatUrl(path, apiRoot));
          if (options && options.query) {
            request.query(options.query);
          }
          if (options && options.data) {
            request.send(options.data);
          }
          request.end(function (err, res) {
            if (err) {
              reject(res && res.body || err);
            } else {
              resolve(res.body);
            }
          });
        });
      };
    });
  }

  _createClass(Request, [{
    key: 'formatUrl',
    value: function formatUrl(path, apiRoot) {
      if (hasProtocol(path)) {
        return path;
      }
      return apiRoot + (path[0] !== '/' ? '/' + path : path);
    }
  }, {
    key: 'hasProtocol',
    value: function hasProtocol(path) {
      return path.indexOf('http://') === 0 || path.indexOf('https://') === 0;
    }
  }]);

  return Request;
})();

exports['default'] = Request;
module.exports = exports['default'];
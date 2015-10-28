'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = requestMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

function requestMiddleware(_ref) {
  var apiRoot = _ref.apiRoot;
  var successValid = _ref.successValid;

  var request = new _request2['default'](apiRoot);

  return function (_ref2) {
    var dispatch = _ref2.dispatch;
    var getState = _ref2.getState;

    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState);
        }

        var promise = action.promise;
        var type = action.type;

        var params = _objectWithoutProperties(action, ['promise', 'type']);

        if (!promise) {
          action.readyState = 'success';
          return next(action);
        }

        next(_extends({}, params, { type: type, readyState: 'request' }));
        return promise(request).then(function (result) {
          if (successValid) {
            var msg = successValid(result);
            if (msg === true) {
              next(_extends({}, params, { result: result, type: type, readyState: 'success' }));
            } else {
              next(_extends({}, params, { error: msg, type: type, readyState: 'failure' }));
            }
          } else {
            next(_extends({}, params, { result: result, type: type, readyState: 'success' }));
          }
        }, function (error) {
          next(_extends({}, params, { error: error, type: type, readyState: 'failure' }));
        })['catch'](function (error) {
          console.error('redux-request-middleware Error: ', error);
          next(_extends({}, params, { error: error, type: type, readyState: 'failure' }));
        });
      };
    };
  };
}

module.exports = exports['default'];
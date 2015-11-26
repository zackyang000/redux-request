import Request from './request';

const PREFIX = '[REQUEST]';

export default function requestMiddleware(apiRoot) {
  const request = new Request(apiRoot);

  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, type, ...params } = action;

      if (!promise) {
        return next(action);
      }

      next({...params, type: `${PREFIX}${type}`});
      return promise(request).then((result) => {
        return next({...params, result, type});
      }, (error) => {
        return next({...params, error, type});
      }).catch((error)=> {
        console.error('redux-request-middleware Error: ', error);
        return next({...params, error, type});
      });
    };
  };
}

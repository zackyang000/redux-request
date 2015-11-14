import Request from './request';

export default function requestMiddleware(apiRoot) {
  const request = new Request(apiRoot);

  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, type, ...params } = action;

      if (!promise) {
        action.readyState = 'success';
        return next(action);
      }

      next({...params, type, readyState: 'request'});
      return promise(request).then((result) => {
        return next({...params, result, type, readyState: 'success'});
      }, (error) => {
        return next({...params, error, type, readyState: 'failure'});
      }).catch((error)=> {
        console.error('redux-request-middleware Error: ', error);
        return next({...params, error, type, readyState: 'failure'});
      });
    };
  };
}

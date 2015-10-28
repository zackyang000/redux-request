import Request from './request';

export default function requestMiddleware({apiRoot, handle}) {
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
        if (handle) {
          const msg = handle(result);
          if (msg === true) {
            next({...params, result, type, readyState: 'success'});
          } else {
            next({...params, error: msg, type, readyState: 'failure'});
          }
        } else {
          next({...params, result, type, readyState: 'success'});
        }
      }, (error) => {
        next({...params, error, type, readyState: 'failure'});
      }).catch((error)=> {
        console.error('redux-async-middleware Error: ', error);
        next({...params, error, type, readyState: 'failure'});
      });
    };
  };
}

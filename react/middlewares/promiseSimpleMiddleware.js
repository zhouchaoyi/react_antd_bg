
import { isPromise } from '../utils';

export default function promiseMiddleware(config = {}) {

  return (_ref) => {
    const dispatch = _ref.dispatch;

    return next => action => {
      if (!isPromise(action.payload)) {
        return next(action);
      }

      const { type, payload, meta } = action;
      const { promise, data } = payload;

      const isAction = resolved => resolved && (resolved.meta || resolved.payload);
      const isThunk = resolved => typeof resolved === 'function';
      const getResolveAction = isError => ({
        type: `${type}`,
        ...!!meta ? { meta } : {},
        ...!!isError ? { error: true } : {}
      });

      /**
       * Re-dispatch one of:
       *  1. a thunk, bound to a resolved/rejected object containing ?meta and type
       *  2. the resolved/rejected object, if it looks like an action, merged into action
       *  3. a resolve/rejected action with the resolve/rejected object as a payload
       */
      action.payload.promise = promise.then(
        (resolved = {}) => {
          resolved = JSON.parse(resolved);
          //console.log(resolved.status);
          const resolveAction = getResolveAction();
          // return dispatch({
          //   type:"LOGIN",
          //   data:{
          //     loginName:"hehe"
          //   }
          // });
          return dispatch(isThunk(resolved) ? resolved.bind(null, resolveAction) : {
            ...resolveAction,
            ...isAction(resolved) ? resolved : {
              ...!!resolved && { payload: resolved }
            }
          });
        },
        (rejected = {}) => {
          console.log("rejected<<<<<<<<");
          // const resolveAction = getResolveAction(true);
          // return dispatch(isThunk(rejected) ? rejected.bind(null, resolveAction) : {
          //   ...resolveAction,
          //   ...isAction(rejected) ? rejected : {
          //     ...!!rejected && { payload: rejected }
          //   }
          // });
        }
      );

      return action;
    };
  };
}

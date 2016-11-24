import {
  LOGIN_PENDING,
  LOGIN,
  LOGIN_ERROR,
  LOGOUT_SUCCESS,
  FETCH_PROFILE
} from '../actions/user';
const _validateStatus={
  name:"",
  pwd:''
}




const initialState = {
  user: null,
  loggingIn: false,
  loggingOut: false,
  loginErrors: null,
  validateStatus:_validateStatus
};

export default function auth(state = initialState, action = {}) {
  switch (action.type) {
    // case LOGIN_PENDING:
    //   return Object.assign({}, initialState, {loggingIn: true});
    case LOGIN:
      console.log(action);
      return Object.assign({}, state, {user: action.payload.data.loginName, loggingIn: false, loginErrors: action.payload.status});
    // case LOGIN_ERROR:
    //   return {
    //     ...state,
    //     loggingIn: false,
    //     user: null,
    //     loginErrors: action.payload.message
    //   };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null,
        loginErrors: null
      };
    case FETCH_PROFILE:
      //console.log("action.payload.data<<<<<<<<<<<<<<<<<<");
      //console.log(action.payload.data);
      return Object.assign({}, state, {user: action.payload.data, loggingIn: false, loginErrors: null});
    default:
      return state;
  }
}

import api from '../api'

import {getCookie,getParamFromToken} from '../utils';

export const FETCH_PROFILE = 'FETCH_PROFILE';

export const LOGIN_PENDING = 'LOGIN_PENDING';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN = 'LOGIN';

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export function fetchProfile() {
    let token=getCookie("token");
    if(null==token) {
        return {type: 'UID_NOT_FOUND'};
    }
    let userId=getParamFromToken(token,"userId");
    return {
        type: 'FETCH_PROFILE',
        payload: {
          promise: api.post('/userMgmt/queryUserById',{
              data:{
                  id:userId,
                  showName: 1
              }
          })
        }
    }
}

export function login(user, password) {
  return {
      type: 'LOGIN',
      payload: {
        promise: api.post('/userMgmt/login', {
          data: {
            loginName: user,
            password: password
          }
        })
      }
  }
}

export function logout(user) {

    return {
        type: 'LOGOUT',
        payload: {
            promise: api.put('/loginOut', {
                data: {
                    user: user
                }
            })
        }
    }
}

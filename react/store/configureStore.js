import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';

import promiseSimpleMiddleware from '../middlewares/promiseSimpleMiddleware'

import user from '../reducers/user';
import menu from '../reducers/menu';
import admin_list from '../reducers/admin_list'
import set_user_group from '../reducers/set_user_group'
import perm from '../reducers/perm'
import solution from '../reducers/solution'
import whitePage from '../reducers/whitePage'
import activity from '../reducers/activity'
import material from '../reducers/material'
import user_type from '../reducers/user_type'
import weChat_menu from '../reducers/weChat_menu'
import follower from '../reducers/follower'
import msg from '../reducers/msg'
import video from '../reducers/video'


const reducer = combineReducers({user, menu, admin_list,set_user_group,perm,solution,whitePage,activity,material,user_type,weChat_menu,follower,msg,video});

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  promiseSimpleMiddleware()
)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}

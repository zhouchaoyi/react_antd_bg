import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';

import promiseSimpleMiddleware from '../middlewares/promiseSimpleMiddleware'

import user from '../reducers/user';
import menu from '../reducers/menu';
import admin_list from '../reducers/admin_list'
import set_user_group from '../reducers/set_user_group'
import perm from '../reducers/perm'
import department_list from '../reducers/department_list'
import user_group from '../reducers/user_group'
import user_group_member from '../reducers/user_group_member'
import module from '../reducers/module'
import user_type from '../reducers/user_type'
import control_panel from '../reducers/control_panel'


const reducer = combineReducers({user, menu, admin_list,set_user_group,perm,department_list,user_group,user_group_member,module,user_type,control_panel});

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  promiseSimpleMiddleware()
)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}

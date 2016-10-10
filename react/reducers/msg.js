/**
 * Created by Liya on 2016/6/8.
 */
import React from 'react'
import initialState from '../store/msg'

export default function(state=initialState,action={}){
    switch (action.type) {
        case 'show_msgBox':
            console.log("---------------")
            return Object.assign({}, state, {isShowBox: action.payload,defaultValue:action.meta })




        default:
            return state;
    }




}
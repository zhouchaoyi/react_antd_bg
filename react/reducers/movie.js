import React from 'react'

import {
    GET_MOVIE_PENDING,
    GET_MOVIE_SUCCESS
} from '../actions/movie'

import initialState from '../store/movie'

export default function (state = initialState, action = {}) {

    //console.log('action type=>' + action.type)
    //console.log("sssssss")
    switch (action.type) {
        case 'normal':
            return Object.assign({}, state, {msg: action.payload + ' --from reducer'})
        case 'box':
            return Object.assign({}, state, {isShowBox: action.payload})

        case GET_MOVIE_PENDING:
            return Object.assign({}, state, {loading: 1})

        case GET_MOVIE_SUCCESS:
            return Object.assign({}, state, {tableData: action.payload, loading: 2})
        default:
            return state;
    }

}
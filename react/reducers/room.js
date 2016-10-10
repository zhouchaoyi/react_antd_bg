


import initialState from '../store/room'

export default function (state = initialState, action = {}) {


    switch (action.type) {

        case 'edit':
            return Object.assign({}, state, {title: '其他房间ppppp'})

        default:
            return state;
    }

}
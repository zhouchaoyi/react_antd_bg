import api from '../api'

export const GET_MOVIE_PENDING = 'GET_MOVIE_PENDING'
export const GET_MOVIE_SUCCESS = 'GET_MOVIE_SUCCESS'

export function updateMsg(newMsg) {
    return {
        type: 'normal',
        payload: newMsg
    }
}

export function showBox(isShow) {
    return {
        type: 'box',
        payload: isShow
    }
}

export function getMovie() {
    return {
        type: 'GET_MOVIE',
        payload: {
            promise: api.post('/movie')
        }
    }

}
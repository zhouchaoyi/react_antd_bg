import Api from './api';

const api = new Api({
  baseURI: '/api/v1',
  //baseURI: 'http://localhost:8080/bgSys',
  headers: {
    'Accept': 'application/json; charset=utf-8',
    'Content-Type': 'application/json; charset=utf-8'
  }
})

export default api

import api from '../api'

export const GET_SERIES_PENDING = 'GET_SERIES_PENDING'
export const GET_SERIES_SUCCESS = 'GET_SERIES_SUCCESS'


export const DEL_SERIES_PENDING = 'DEL_SERIES_PENDING'
export const DEL_SERIES_SUCCESS = 'DEL_SERIES_SUCCESS'



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
export function showEditBox(isShow,otherInfo){

    return{
        type:'eidtBox',
        meta: otherInfo,
        payload:isShow
    }
}
export function getCategory() {
    return {
        type: 'GET_CATEGORY',
        payload: {
            promise: api.post('/productCate',{

            })
        }
    }

}
export function getSeries(cateId) {
    return {
        type: 'GET_SERIES',
        payload: {
            promise: api.post('/series',{
                data:{
                    cateId:cateId
                }
            })
        }
    }

}
export function addSeries(data){

    return{
        type:'ADD_SERIES',
        meta:data,
        payload:{
            promise:api.post('/addSeries',{
                data:{data}
            })
        }
    }
}
export function editSeries(id,data){
    return {
        type:'EDIT_SERIES',
        meta:data,
        payload:{
            promise:api.post('/editSeries',{
                data:{
                    Id:id,
                    PostValue: data
                }
            })
        }
    }
}

export function deleteSeries(id) {
    return {
        type: 'DEL_SERIES',
        meta:id,
        payload: {
            promise: api.post('/deleteSeries',{
                data:{
                    Id:id
                }
            })
        }
    }

}
export function getSeriesDetail(id){
    return{
        type:'DETAIL_SERIES',
        payload:{
            promise:api.post('/seriesDetail',{
                data:{
                    Id:id
                }
            })
        }
    }
}
export function getSeriesNameById(id){
    return {
        type: 'GET_SERIESNAME',
        payload: {
            promise: api.post('/getSeriesById', {
                data: {
                    Id: id
                }
            })
        }
    }
}







export function addProductCate(data){
    return{
        type:'ADD_PRODUCTCATE',
        meta:data,
        payload:{
            promise:api.post('/addProductCate',{
                data:{data}
            })
        }
    }
}
export function deleteProductCate(id){
    return {
        type: 'DEL_PRODUCTCATE',
        payload: {
            promise: api.post('/deleteProductCate',{
                data:{
                    Id:id
                }
            })
        }
    }
}
export function editProductCate(id,data){
    return {
        type:'EDIT_PRODUCTCATE',
        meta:data,
        payload:{
            promise:api.post('/editProductCate',{
                data:{
                    Id:id,
                    PostValue: data
                }
            })
        }
    }
}

export function getProduct(seriesId){
    return{
        type:'GET_PRODUCT',
        payload:{
            promise:api.post('/getProduct',{
                data:{
                    Id:seriesId
                }
            })
        }
    }
}
export function deleteProduct(id){
    return{
        type:'DEL_PRODUCT',
        payload:{
            promise:api.post('/delProduct',{
                data:{
                    Id:id
                }
            })
        }
    }
}
export function addProduct(data){
    return{
        type:'ADD_PRODUCT',
        meta:data,
        payload:{
            promise:api.post('/addProduct',{
                data:{data}
            })
        }
    }
}
export function editProduct(id,data){
    return {
        type:'EDIT_PRODUCT',
        meta:data,
        payload:{
            promise:api.post('/editProduct',{
                data:{
                    Id:id,
                    PostValue: data
                }
            })
        }
    }
}
export function getProductDetail(id){
    return{
        type:'DETAIL_PRODUCT',
        payload:{
            promise:api.post('/productDetail',{
                data:{
                    Id:id
                }
            })
        }
    }
}


/**
 * Created by Liya on 2016/5/17.
 */
import api from '../api'

export function getPic(id){
    return{
        type:'GET_PIC',
        payload:{
            promise:api.post('/getPic',{
                data:{
                    cateId:id
                }
            })
        }
    }
}
//删除图片系列
export function deletePicSerise(id){
    return{
        type:'DEL_PICSERISE',
        payload:{
            promise:api.post('/deletePicSerise',{
                data:{
                    Id:id
                }
            })
        }
    }
}
export function getPicDetail(id){
    return{
        type:'DETAIL_PIC',
        payload:{
            promise:api.post('/picDetail',{
                data:{
                    Id:id
                }
            })
        }
    }
}
export function editPicDetail(id,data){
    return{
        type:'EDIT_PIC',
        meta:data,
        payload:{
            promise:api.post('/editPic',{
                data:{
                    Id:id,
                    PostValue:data
                }
            })
        }
    }
}
export function addPicDetail(data){
    return{
        type:'ADD_PIC',
        meta:data,
        payload:{
            promise:api.post('/addPic',{
                data:{data}
            })
        }
    }
}

export function getPoster(){
    return{
        type:'GET_POSTER',
        payload:{
            promise:api.post('/getPoster',{
               
            })
        }
    }
}
export function deletePoster(id){
    return{
        type:'DEL_POSTER',
        payload:{
            promise:api.post('/deletePoster',{
                data:{
                    Id:id
                }
            })
        }
    }
}
export function getPosterDetail(id){
    return{
        type:'DETAIL_POSTER',
        payload:{
            promise:api.post('/posterDetail',{
                data:{
                    Id:id
                }
            })
        }
    }
}
export function editPosterDetail(id,data){
    return{
        type:'EDIT_POSTER',
        meta:data,
        payload:{
            promise:api.post('/editPoster',{
                data:{
                    Id:id,
                    PostValue:data
                }
            })
        }
    }
}
export function addPoster(data){
    return{
        type:'ADD_POSTER',
        meta:data,
        payload:{
            promise:api.post('/addPoster',{
                data:{data}
            })
        }
    }
}
export function getPage(){
    return{
        type:'GET_PAGE',
        payload:{
            promise:api.post('/getPage',{

            })
        }
    }
}
export function deletePage(id){
    return{
        type:'DEL_PAGE',
        payload:{
            promise:api.post('/deletePage',{
                data:{
                    Id:id
                }
            })
        }
    }
}
export function getPageDetail(id){
    return{
        type:'DETAIL_PAGE',
        payload:{
            promise:api.post('/pageDetail',{
                data:{
                    Id:id
                }
            })
        }
    }
}
export function editPage(id,data){
    return{
        type:'EDIT_PAGE',
        meta:data,
        payload:{
            promise:api.post('/editPage',{
                data:{
                    Id:id,
                    PostValue:data
                }
            })
        }
    }
}
export function addPageDetail(data){
    return{
        type:'ADD_PAGE',
        meta:data,
        payload:{
            promise:api.post('/addPage',{
                data:{data}
            })
        }
    }
}

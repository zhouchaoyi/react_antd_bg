/**
 * Created by Liya on 2016/6/3.
 */
import api from '../api'

export function deleteWXMenu(id){
    return {
        type: 'del_wxmenu',
        meta: id
    }
}
export function showEditBox(isShow,data){
    return{
        type:'show_editMenu',
        meta:data,
        payload:isShow
    }
}
export function editWXMenu(id,data){
    return{
        type:'edit_wxmenu',
        payload:{
            data:{
                Id:id,
                PostValue:data
            }
        }
    }
}
export function addSubMenu(parId,data){
    return{
        type:'add_subMenu',
        payload:{
            data:{
                ParId:parId,
                PostValue:data
            }
        }
    }
}
export function addMenu(data){
    return{
        type:'add_menu',
        payload:{
            data:{
                PostValue:data
            }
        }
    }
}
export function getMenu(){
    return{
        type:'GET_MENU',
        payload:{
            promise:api.get('/getMenu')
        }
    }
}
export function createMenu(data){
    return{
        type:'CREATE_MENU',
        payload:{
            promise:api.post('/createMenu',{
                data:{
                    PostValue:data
                }
            })
        }
    }
}
/**
 * Created by Liya on 2016/6/16.
 */

import initialState from '../store/video'
export default function(state=initialState,action={}){
    //console.log('action type=>' + action.type);
    switch (action.type){
        case 'show_videoBox':
            return Object.assign({},state,{isShowBox:action.payload})
        case 'show_editBox':
            return Object.assign({},state,{isShowEditBox:action.payload,getPropsValue:action.meta})

        case 'GET_VIDEO_SUCCESS':
            return Object.assign({},state,{tableData:action.payload})

        case 'ADD_VIDEO_SUCCESS':
            const newTableData=[]
            if(action.payload.result==0){
                console.log("添加失败")
            }else if(action.payload.result==1){
                newTableData.push(Object.assign({key:action.payload.id},action.meta))
                state.tableData.map(x=>{
                    newTableData.push(x)
                })
            }
            return Object.assign({},state,{tableData:newTableData})

        case 'DEL_VIDEO_SUCCESS':
            const deleteTableData=[]
            if(action.payload.result==0){
                console.log("失败")
            }else if(action.payload.result==1){
                state.tableData.map(x=>{
                    if(x.Id!=action.meta){
                        deleteTableData.push(x)
                    }
                })
            }
            return Object.assign({},state,{tableData:deleteTableData})

        case 'EDIT_VIDEO_SUCCESS':
            const  editTableData=[];
            if(action.payload.result==0){
                console.log("修改失败");
                state.tableData.map(x=>{
                    editTableData.push(x)
                })
            }else if(action.payload.result==1){
                console.log("成功")
                state.tableData.map(x=>{
                    if(x.key==action.payload.id){
                        editTableData.push(Object.assign(action.meta,{key:action.payload.id}) )

                    }else{
                        editTableData.push(x)
                    }
                })
            }
            return Object.assign({}, state, {tableData: editTableData})

        default:
            return state
    }

}

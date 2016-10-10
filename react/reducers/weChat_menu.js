/**
 * Created by Liya on 2016/6/3.
 */


import initialState from '../store/weChat_menu'

export default function (state = initialState, action = {}) {


    switch (action.type) {

        case 'show_editMenu':
            return Object.assign({}, state, {isShowEditBox:action.payload,defaultValue:action.meta})
        case 'GET_MENU_SUCCESS':
            console.log("action.payload:", action.payload)
            const tem=[];
            action.payload.forEach(button=>{
                button["button"].forEach((item,index)=>{
                    const child=[];
                    if( item.sub_button){
                        item.sub_button.forEach((sub,index2)=>{
                            child.push({key:sub.key,name:sub.name,type:sub.type,url:sub.url})
                        })
                        tem.push( {key:item.key,name:item.name,type:item.type,children:child})
                    }else{
                        tem.push( {key:item.key,name:item.name,type:item.type,url:item.url})
                    }

                })
            })

            return Object.assign({},state,{tableData:tem})

        case 'CREATE_MENU_SUCCESS':
            return Object.assign({},state)

        case 'edit_wxmenu':
            const editTableData=[]
            console.log("reduce edit:",action)
            state.tableData.map(x=>{
                const postData=action.payload.data
                if(x.key==postData.Id){
                    editTableData.push(Object.assign({key:x.key},postData.PostValue))
                }else{
                    editTableData.push(x)
                }
            })
            console.log(editTableData)
            return Object.assign({},state,{tableData:editTableData})

        case 'add_subMenu':
            const addTableData=[];
            const postData=action.payload.data
            state.tableData.map((x,index)=>{
                if(x.key==postData.ParId){
                    if(!x.children){
                        //没有先添加该元素

                        const temp=[]

                        temp.push(Object.assign({key:x.key+index},postData.PostValue))
                        x.children=temp
                        addTableData.push(x)

                    }
                    else{
                        //已经存在子节点添加多个子节点

                        let keyValue=x.key+"_"+(x.children.length+1)
                        x.children.push(Object.assign({key:keyValue},postData.PostValue))
                        addTableData.push(x)
                    }
                }else{
                    addTableData.push(x)
                }
            })
            return Object.assign({},state,{tableData:addTableData})




        case 'del_wxmenu':
            const newTableData=[]
            state.tableData.forEach(x=>{
                if(x.key!==action.meta){
                    newTableData.push(x)
                }
            })

            return Object.assign({}, state, {tableData: newTableData})

        case 'add_menu':
            const addTableData2=[];
            const postData2=action.payload.data
            state.tableData.map((x,index)=>{
                addTableData2.push(x)
            })
            addTableData2.push(Object.assign({key:"2"},postData2.PostValue))
            return Object.assign({},state,{tableData:addTableData2})



        default:
            return state;
    }

}
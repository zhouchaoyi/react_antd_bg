import api from '../api'

export const GET_SOLUTION_PENDING = 'GET_SOLUTION_PENDING'
export const GET_SOLUTION_SUCCESS = 'GET_SOLUTION_SUCCESS'
export const DETAIL_SOLUTION_SUCCESS='DETAIL_SOLUTION_SUCCESS'




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
        type: 'SOLUTIOB_CATE',
        payload: {
            promise: api.post('/industryCate',{

            })
        }
    }

}
export function addSolutionCate(data){
    return{
        type:'ADD_SOLUTIONCATE',
        meta:data,
        payload:{
            promise:api.post('/addSolutionCate',{
                data:{data}
            })
        }
    }
}
export function deleteSolutionCate(id){
    return {
        type: 'DEL_SOLUTIONCATE',
        payload: {
            promise: api.post('/deleteSolutionCate',{
                data:{
                    Id:id
                }
            })
        }
    }
}
export function editSolutionCate(id,data){
    return {
        type:'EDIT_SOLUTIONCATE',
        meta:data,
        payload:{
            promise:api.post('/editSolutionCate',{
                data:{
                    Id:id,
                    PostValue: data
                }
            })
        }
    }
}
export function getAllSolution(cateId) {
    console.log("getAllSolutiongetAllSolution");
    return {
        type: 'GET_SOLUTION',
        payload: {
            promise: api.post('/solution',{
                data:{
                    cateId:cateId
                }
            })
        }
    }

}
export function deleteSolution(id){
    console.log("deleteSolution  id:",id);
    return {
        type: 'DEL_SOLUTION',
        payload: {
            promise: api.post('/deleteSolution',{
                data:{
                    Id:id
                }
            })
        }
    }

}
export function addSolution(data){
    return{
        type:'ADD_SOLUTION',
        meta:data,
        payload:{
            promise:api.post('/addSolution',{
                data:{data}
            })
        }
    }

}

//根据id获取详细信息

export function getSolutionDetail(id){
    return{
        type:'DETAIL_SOLUTION',
        payload:{
            promise:api.post('/solutionDetail',{
                data:{
                    Id:id
                }
            })
        }
    }
}
export function editSolutionDetail(id,data){
    return{
        type:'EDIT_SOLUTION',
        meta:data,
        payload:{
            promise:api.post('/editSolution',{
                data:{
                    Id:id,
                    PostValue:data
                }
            })
        }
    }
}





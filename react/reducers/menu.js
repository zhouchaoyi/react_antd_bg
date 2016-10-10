import _ from 'lodash';

import {
    GET_ALL_MENU,
    GET_ALL_MENU_SUCCESS,
    UPDATE_NAVPATH
} from '../actions/menu';

const initialState = {

    selectedKey: ['menu103'],

    currentIndex: 0,
    items: [],
    navpath: []
};

function getCurrentKey(menus, aPath) {
    let cPath = []
    menus.map((item)=> {
        item.child.map((sub)=> {
            if (aPath.startsWith(sub.link)) { // 判断当前路径是否吻合
                cPath.push('menu' + sub.key)
            }
        })
    })

    return cPath
}

//将两层结构转换为三层结构
function trans(menus) {
    for(let i=0;i<menus.length;i++) {
        let child = [];
        let k = -1;
        for(let j=0;j<menus[i].child.length;j++) {
            let item = menus[i].child[j];
            if(item.level==2) {
                k++;
                child[k]= item;
                child[k].child=[];
            }else {
                child[k].child.push(item);
            }
        }
        menus[i].child=child;
    }
    // console.log("将两层结构转换为三层结构<<<<<<<");
    // console.log(menus);
    return menus;
}

export default function menu(state = initialState, action = {}) {
    switch (action.type) {


        case GET_ALL_MENU:

            let menus = action.payload.data.menu;
            //let cPath = getCurrentKey(menus,action.meta)
            //转换一下格式
            menus = trans(menus);
            let cPath="";
            return Object.assign({}, initialState, {items: menus, selectedKey: cPath});


        case UPDATE_NAVPATH:
            let navpath = [], tmpOb, tmpKey, child;
            if (action.payload.data) {
                action.payload.data.reverse().map((item)=> {
                    if (item.indexOf('sub') != -1) {
                        tmpKey = item.replace('sub', '');
                        tmpOb = _.find(state.items, function (o) {
                            return o.key == tmpKey;
                        });
                        child = tmpOb.child;
                        navpath.push({
                            key: tmpOb.key,
                            name: tmpOb.name
                        })
                    }
                    if (item.indexOf('menu') != -1) {
                        tmpKey = item.replace('menu', '');
                        if (child) {
                            tmpOb = _.find(child, function (o) {
                                return o.key == tmpKey;
                            });
                        }
                        navpath.push({
                            key: tmpOb.key,
                            name: tmpOb.name
                        })
                    }
                })
            }

            let xPath = getCurrentKey(state.items, action.payload.currentPath)

            return Object.assign({}, state, {
                currentIndex: action.payload.key * 1,
                navpath: navpath,
                selectedKey: xPath
            });


        default:
            return state;
    }
}

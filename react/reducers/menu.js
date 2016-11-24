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
            //console.log(menus);
            //let cPath = getCurrentKey(menus,action.meta)
            //转换一下格式
            menus = trans(menus);
            let cPath="";
            let path = action.meta;
            let navPath=[];
            if(path!="/home") {
                menus.map(item1 => {
                    item1.child.map(item2 => {
                        let tmpOb = _.find(item2.child, function (o) {
                            return path == ('/'+o.url.substring(0,o.url.indexOf("\.")));
                        });
                        if(tmpOb) {
                            navPath.push({
                                key: item1.itemId,
                                name: item1.itemName
                            });
                            navPath.push({
                                key: item2.itemId,
                                name: item2.itemName
                            });
                            navPath.push({
                                key: tmpOb.itemId,
                                name: tmpOb.itemName
                            });
                        }
                    });
                });
            }
            return Object.assign({}, initialState, {items: menus, selectedKey: cPath,navpath: navPath});

        // case UPDATE_NAVPATH_BY_RELOAD:
        //     let path = action.payload;

        case UPDATE_NAVPATH:
            //console.log(state.items);
            let navpath = [], tmpOb, tmpKey, child;
            if (action.payload.data) {
                action.payload.data.reverse().map((item)=> {
                    if (item.indexOf('sub') != -1) {
                        tmpKey = item.replace('sub', '');
                        tmpOb = _.find(state.items, function (o) {
                            return o.itemId == tmpKey;
                        });
                        child = tmpOb.child;
                        navpath.push({
                            key: tmpOb.itemId,
                            name: tmpOb.itemName
                        })
                    }
                    if (item.indexOf('menu') != -1) {
                        tmpKey = item.replace('menu', '');
                        let tmpChild;
                        if (child) {
                            child.map(item => {
                                let tmp = _.find(item.child, function (o) {
                                    return o.itemId == tmpKey;
                                });
                                if(tmp) {
                                    tmpOb = tmp;
                                    tmpChild=item;
                                    //console.log("tmpChild="+tmpChild+"<<<<<<");
                                }
                            });
                        }
                        navpath.push({
                            key: tmpChild.itemId,
                            name: tmpChild.itemName
                        })
                        navpath.push({
                            key: tmpOb.itemId,
                            name: tmpOb.itemName
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

/**
 * Created by zhouchaoyi on 2016/10/10.
 */
import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon, Button, Table,Modal,Input,Checkbox,Select} from 'antd';
import {listItems,delItem,searchChange,doMove,showClose,getGridParentItem,parentClassIdChange} from '../../../actions/control_panel'
import {getOptions} from '../../../utils'

const confirm = Modal.confirm;
const Option = Select.Option;
const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

let keys=[];
let rows=[];
function noop() {
    return false;
}


class GridComponent extends React.Component {

    constructor(props) {
        super(props)
    }

    componentWillMount(){
        //console.log("componentWillMount<<<<<<<<<");
        let param = {};
        param.currentPage = this.props.tableData.currentPage;
        param.pageSize = this.props.tableData.pageSize;
        param.searchStr = this.props.searchText;
        param.parentClassId = this.props.parentClassId;
        param.status = this.props.status;
        param.orderBy = this.props.orderBy;
        this.props.listItems(param);
        //获取父节点信息
        let param2 = {};
        param2.currentPage=-1;
        param2.pageSize=-1;
        param2.orderBy=this.props.orderBy;
        param2.classLevel=1;
        param2.status=this.props.status;
        this.props.getGridParentItem(param2);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.reloadGrid) {
            //console.log("come in componentWillReceiveProps <<<<<<<<<<");
            let param = {};
            param.currentPage = nextProps.tableData.currentPage;
            param.pageSize = nextProps.tableData.pageSize;
            param.searchStr = nextProps.searchText;
            param.parentClassId = nextProps.parentClassId;
            param.status = nextProps.status;
            param.orderBy = nextProps.orderBy;
            this.props.listItems(param);
            if(nextProps.status!=this.props.status) {
                //重新获取父节点信息
                let param2 = {};
                param2.currentPage=-1;
                param2.pageSize=-1;
                param2.orderBy=nextProps.orderBy;
                param2.classLevel=1;
                param2.status=nextProps.status;
                this.props.getGridParentItem(param2);
            }
        }
    }

    onShowBox(e) {
      this.props.showBox(true)
    }

    addItem(e) {
        if(keys.length == 0) {
            this.context.router.push({
                pathname: "/template/perm/control_panel_list/form",
                query: {
                    parentId: "-1",
                    classId: ""
                }
            });
        }else {
            if(keys.length>1) {
                Modal.warning({
                    title: '只能选择一条记录',
                    content: '',
                });
                return;
            }
            if(rows[0].classId.length>20) {
                Modal.warning({
                    title: '不能再增加子节点！请不选择节点或者选择第一、第二层的节点添加子节点！',
                    content: ''
                });
                return;
            }
            keys=[];
            this.context.router.push({
                pathname: "/template/perm/control_panel_list/form",
                query: {
                    parentId: rows[0].itemId,
                    classId: rows[0].classId
                }
            });
        }
    }

    editItem(item,e) {
        //console.log(item);
        this.context.router.push({
            pathname: "/template/perm/control_panel_list/form",
            query: {
                id: item.itemId,
                classId: item.classId.substring(0,item.classId.length-10)
            }
        });
    } 

    delItem(id,e) {
        let _self = this;
        if(id=="" && keys.length==0) {
            Modal.warning({
                title: '请选择要删除的项',
                content: '',
            });
            return;
        }
        confirm({
            title: '确定要删除吗',
            content: '',
            onOk() {
                let ids = "";
                if(id!="") {
                    ids = id;
                }else {
                    ids = keys.join(",");
                }
                //console.log(ids);
                _self.props.delItem(ids,_self.props.tableData);
            },
            onCancel() {},
        });
    } 

    search(e) {
        //console.log(this.refs.searchText.refs.input.value);
        let param = {};
        param.currentPage = 1;
        param.pageSize = this.props.tableData.pageSize;
        param.searchStr = this.props.searchText;
        param.parentClassId = this.props.parentClassId;
        param.status = this.props.status;
        param.orderBy = this.props.orderBy;
        this.props.listItems(param);
    }

    handleInputChange(e) {
        this.props.searchChange(e.target.value);
    }

    addChildItem(e) {
        if(keys.length==0) {
            Modal.warning({
                title: '请选择记录',
                content: '',
            });
            return;
        }
        if(keys.length>1) {
            Modal.warning({
                title: '只能选择一条记录',
                content: '',
            });
            return;
        }
        //console.log(rows);
        this.context.router.push({
            pathname: "/template/user/department_list/form",
            query: {
                parentId: keys[0]
            }
        });
    }

    doMove(position,e) {
        if(keys.length==0) {
            Modal.warning({
                title: '请选择记录',
                content: '',
            });
            return;
        }
        if(keys.length>1) {
            Modal.warning({
                title: '只能选择一条记录',
                content: '',
            });
            return;
        }
        let param = {};
        param.move=position;
        param.id=keys[0];
        this.props.doMove(param);
    }

    showClose(e) {
        //console.log(`checked = ${e.target.checked}`);
        this.props.showClose(e.target.checked);
    }

    parentClassIdChange(value) {
        //console.log("value="+value);
        this.props.parentClassIdChange(value);
    }

    render() {
        let _self = this;

        const tableColumn = [
            {title: '名称', dataIndex: 'itemName',key:'itemName',
                render: (text,record) => {
                    for(var j=1;j<record.classId.length/10;j++){
                        text=<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}</span>;
                    }
                    return <a onClick={this.editItem.bind(this,record)}>{text}</a>
                }
            },
            {title: '对应的权限代码', dataIndex: 'moduleCode',key:'moduleCode'},
            {title: '状态',dataIndex: 'status',key:'status',render: (text) => {
                if(text=="1") {
                    return <span style={{color:"green"}}>启用</span>
                }else if(text=="0") {
                    return <span style={{color:"red"}}>禁用</span>
                }
            }},
            {title: '操作',dataIndex: 'operate',key:'operate',render: (text,record) => {
                return <div>
                            <a onClick={this.editItem.bind(this,record)}><Icon type="edit" /></a> 
                            <span> | </span> 
                            <a onClick={this.delItem.bind(this,record.itemId)}><Icon type="delete" /></a>
                       </div>
            }}
        ];
        
        const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {
                keys=selectedRowKeys;
                rows=selectedRows;
            }
        };

        const pagination = {
            total: this.props.tableData.total,
            pageSize: this.props.tableData.pageSize,
            current: this.props.tableData.currentPage,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                let param = {};
                param.currentPage = current;
                param.pageSize = pageSize;
                param.searchStr = _self.props.searchText;
                param.parentClassId = _self.props.parentClassId;
                param.status = _self.props.status;
                param.orderBy = _self.props.orderBy;
                _self.props.listItems(param);
            },
            onChange(current) {
                let param = {};
                param.currentPage = current;
                param.pageSize = _self.props.tableData.pageSize;
                param.searchStr = _self.props.searchText;
                param.parentClassId = _self.props.parentClassId;
                param.status = _self.props.status;
                param.orderBy = _self.props.orderBy;
                _self.props.listItems(param);
            },
            showTotal: () => "共 "+this.props.tableData.total+" 条记录"
        };

        return (
            <div>
                <h1>控制面板设定</h1>
                <div style={{marginTop:'10px'}}>

                    <Button type="primary"   onClick={this.addItem.bind(this)}>
                        <Icon type="plus"/>
                        添加
                    </Button>
                    <span style={{marginLeft:"10px"}}>选择信息：</span>
                    <Button onClick={this.doMove.bind(this,"1")}>
                        <Icon type="arrow-up"/>上移
                    </Button>
                    <Button style={{marginLeft:'10px'}} onClick={this.doMove.bind(this,"-1")}>
                        <Icon type="arrow-down"/>下移
                    </Button>
                    <Button type="ghost" style={{marginLeft:'10px'}} onClick={this.delItem.bind(this,"")}>
                       <Icon type="delete" />
                        删除
                    </Button>
                    <div style={{float:"right"}}> 
                        <Checkbox onChange={this.showClose.bind(this)} checked={this.props.status} style={{marginRight:"50px"}}>显示关闭的菜单</Checkbox>
                        选择模块：
                        <Select style={{ width: 200,marginRight:"50px" }} value={this.props.parentClassId==""?"-1":this.props.parentClassId}
                            onChange={this.parentClassIdChange.bind(this)} >
                            {getOptions(this.props.gridParentItem,"classId","itemName").map(item => {
                                return <Option key={item.classId}>{item.itemName}</Option>
                            })}
                        </Select>
                        <Input value={this.props.searchText} style={{width:'150px',marginRight:'10px'}} onChange={this.handleInputChange.bind(this)}
                            onPressEnter={this.search.bind(this)} placeholder="请输入关键词" />
                        <Button type="primary" shape="circle">
                            <Icon type="search" onClick={this.search.bind(this)} />
                        </Button>
                    </div>
                </div>

                <div style={{marginTop:'10px'}}>
                    <Table size="small" rowKey="itemId" rowSelection={rowSelection} columns={tableColumn} 
                            dataSource={this.props.tableData.items} pagination={pagination} loading={this.props.loading} />
                </div>
            </div>

        )
    }
    
}

GridComponent.contextTypes = contextTypes;

function mapStateToProps(state) {
    return {
        tableData:state.control_panel.tableData,
        reloadGrid: state.control_panel.reloadGrid,
        loading: state.control_panel.loading,
        searchText: state.control_panel.searchText,
        parentClassId: state.control_panel.parentClassId,
        status: state.control_panel.status,
        orderBy: state.control_panel.orderBy,
        gridParentItem: state.control_panel.gridParentItem
    }
    
}
function mapDispatchToProps(dispatch) {
    return {
        listItems:bindActionCreators(listItems,dispatch),
        delItem:bindActionCreators(delItem,dispatch),
        searchChange:bindActionCreators(searchChange,dispatch),
        doMove:bindActionCreators(doMove,dispatch),
        showClose:bindActionCreators(showClose,dispatch),
        getGridParentItem:bindActionCreators(getGridParentItem,dispatch),
        parentClassIdChange:bindActionCreators(parentClassIdChange,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(GridComponent)


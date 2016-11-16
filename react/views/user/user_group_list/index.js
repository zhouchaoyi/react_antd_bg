/**
 * Created by zhouchaoyi on 2016/10/10.
 */
import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon, Button, Table,Modal,Input} from 'antd';
import {listItems,delItem,searchChange} from '../../../actions/user_group'
import UserTypeFormModel from './form'

const confirm = Modal.confirm;
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
        console.log("componentWillMount<<<<<<<<<");
        this.props.listItems(this.props.tableData.currentPage,this.props.tableData.pageSize,this.props.searchText);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.reloadGrid) {
            //console.log("come in componentWillReceiveProps <<<<<<<<<<");
            this.props.listItems(this.props.tableData.currentPage,this.props.tableData.pageSize,this.props.searchText);
        }
    }

    onShowBox(e) {
      this.props.showBox(true)
    }

    addItem(e) {
      this.context.router.push('/template/user/user_group_list/form');
    }

    editItem(id,e) {
        //console.log(e);
        this.context.router.push({
            pathname: "/template/user/user_group_list/form",
            query: {id: id}
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
        this.props.listItems(1,this.props.tableData.pageSize,this.props.searchText);
    }

    handleInputChange(e) {
        this.props.searchChange(e.target.value);
    }

    setUserGroupMember(e) {
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
            pathname: "/template/user/user_group_member",
            query: {
                groupId: keys[0],
                groupName: rows[0].groupName    
            }
        });
    }

    setPerm(e) {
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
            pathname: "/template/perm/perm",
            query: {
                id: keys[0],
                name: rows[0].groupName,
                type: 1    
            }
        });
    }

    render() {
        let _self = this;
        const tableColumn = [
            {title: '组名称', dataIndex: 'groupName',key:'groupName',
                render: (text,record) => {
                    return <a onClick={this.editItem.bind(this,record.groupId)}>{text}</a>
                }
            },
            {title: '成员人数', dataIndex: 'memberCount',key:'memberCount'},
            {title: '说明', dataIndex: 'remark',key:'remark'},
            {title: '状态',dataIndex: 'status',key:'status',render: (text) => {
                if(text=="1") {
                    return <span style={{color:"green"}}>启用</span>
                }else if(text=="0") {
                    return <span style={{color:"red"}}>禁用</span>
                }
            }},
            {title: '操作',dataIndex: 'operate',key:'operate',render: (text,record) => {
                return <div>
                            <a onClick={this.editItem.bind(this,record.groupId)}><Icon type="edit" /></a> 
                            <span> | </span> 
                            <a onClick={this.delItem.bind(this,record.groupId)}><Icon type="delete" /></a>
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
                _self.props.listItems(current,pageSize,_self.props.searchText);
            },
            onChange(current) {
                _self.props.listItems(current,_self.props.tableData.pageSize,_self.props.searchText);
            },
            showTotal: () => "共 "+this.props.tableData.total+" 条记录"
        };

        return (
            <div>
                <h1>用户组</h1>
                <div style={{marginTop:'10px'}}>

                    <Button type="primary"   onClick={this.addItem.bind(this)}>
                        <Icon type="plus"/>
                        添加
                    </Button>
                    <span style={{marginLeft:"10px"}}>选择信息：</span>
                    <Button onClick={this.setUserGroupMember.bind(this)}>
                        <Icon type="setting"/>管理成员
                    </Button>
                    <Button style={{marginLeft:'10px'}} onClick={this.setPerm.bind(this)}>
                        <Icon type="setting"/>设置权限
                    </Button>
                    <Button type="ghost" style={{marginLeft:'10px'}} onClick={this.delItem.bind(this,"")}>
                       <Icon type="delete" />
                        删除
                    </Button>
                    <div style={{float:"right"}}> 
                        <Input value={this.props.searchText} style={{width:'150px',marginRight:'10px'}} onChange={this.handleInputChange.bind(this)}
                            onPressEnter={this.search.bind(this)} placeholder="请输入关键词" />
                        <Button type="primary" shape="circle">
                            <Icon type="search" onClick={this.search.bind(this)} />
                        </Button>
                    </div>
                </div>

                <div style={{marginTop:'10px'}}>
                    <Table size="small" rowKey="groupId" rowSelection={rowSelection} columns={tableColumn} 
                            dataSource={this.props.tableData.items} pagination={pagination} loading={this.props.loading} />
                </div>
            </div>

        )
    }
    
}

GridComponent.contextTypes = contextTypes;

function mapStateToProps(state) {
    return {
        tableData:state.user_group.tableData,
        reloadGrid: state.user_group.reloadGrid,
        loading: state.user_group.loading,
        searchText: state.user_group.searchText
    }
    
}
function mapDispatchToProps(dispatch) {
    return {
        listItems:bindActionCreators(listItems,dispatch),
        delItem:bindActionCreators(delItem,dispatch),
        searchChange:bindActionCreators(searchChange,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(GridComponent)


/**
 * Created by zhouchaoyi on 2016/10/10.
 */
import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon, Button, Table,Modal,Input} from 'antd';
import {listItems,delItem,searchChange,doMove} from '../../../actions/department_list'

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
      this.context.router.push('/template/user/department_list/form');
    }

    editItem(id,e) {
        //console.log(e);
        this.context.router.push({
            pathname: "/template/user/department_list/form",
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
                name: rows[0].loginName,
                type: 0    
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
        param.departmentId=keys[0];
        this.props.doMove(param);
    }

    render() {
        let _self = this;

        const tableColumn = [
            {title: '部门名', dataIndex: 'departmentName',key:'departmentName',
                render: (text,record) => {
                    for(var j=1;j<record.classId.length/10;j++){
                        text=<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}</span>;
                    }
                    return <a onClick={this.editItem.bind(this,record.departmentId)}>{text}</a>
                }
            },
            {title: '部门代码', dataIndex: 'departmentKey',key:'departmentKey'},
            {title: '备注', dataIndex: 'remark',key:'remark'},
            {title: '操作',dataIndex: 'operate',key:'operate',render: (text,record) => {
                return <div>
                            <a onClick={this.editItem.bind(this,record.departmentId)}><Icon type="edit" /></a> 
                            <span> | </span> 
                            <a onClick={this.delItem.bind(this,record.departmentId)}><Icon type="delete" /></a>
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
                <h1>部门管理</h1>
                <div style={{marginTop:'10px'}}>

                    <Button type="primary"   onClick={this.addItem.bind(this)}>
                        <Icon type="plus"/>
                        添加
                    </Button>
                    <Button type="primary" style={{marginLeft:'10px'}} onClick={this.addChildItem.bind(this)}>
                        <Icon type="plus"/>
                        添加子节点
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
                        <Input value={this.props.searchText} style={{width:'150px',marginRight:'10px'}} onChange={this.handleInputChange.bind(this)}
                            onPressEnter={this.search.bind(this)} placeholder="请输入关键词" />
                        <Button type="primary" shape="circle">
                            <Icon type="search" onClick={this.search.bind(this)} />
                        </Button>
                    </div>
                </div>

                <div style={{marginTop:'10px'}}>
                    <Table size="small" rowKey="departmentId" rowSelection={rowSelection} columns={tableColumn} 
                            dataSource={this.props.tableData.items} pagination={pagination} loading={this.props.loading} />
                </div>
            </div>

        )
    }
    
}

GridComponent.contextTypes = contextTypes;

function mapStateToProps(state) {
    return {
        tableData:state.department_list.tableData,
        reloadGrid: state.department_list.reloadGrid,
        loading: state.department_list.loading,
        searchText: state.department_list.searchText
    }
    
}
function mapDispatchToProps(dispatch) {
    return {
        listItems:bindActionCreators(listItems,dispatch),
        delItem:bindActionCreators(delItem,dispatch),
        searchChange:bindActionCreators(searchChange,dispatch),
        doMove:bindActionCreators(doMove,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(GridComponent)


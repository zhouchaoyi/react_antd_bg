/**
 * Created by zhouchaoyi on 2016/10/10.
 */
import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon, Button, Table,Modal,Input} from 'antd';
import {listItems,listItems2,delItem,searchChange2,addItem,changeRowKeys,changeRowKeys2} from '../../../actions/user_group_member'
import {getQueryString} from '../../../utils'

const confirm = Modal.confirm;
const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

// let keys=[];
// let keys2=[];
let groupId="";
let groupName="";
let params = {};
function noop() {
    return false;
}


class SetUserGroup extends React.Component {

    constructor(props) {
        super(props)
    }

    componentWillMount(){
        //console.log("componentWillMount<<<<<<<<<");
        groupId = getQueryString("groupId");
        groupName = getQueryString("groupName");
        params.groupId=groupId;
        this.props.listItems(params,this.props.tableData.currentPage,this.props.tableData.pageSize,this.props.searchText);
        this.props.listItems2(params,this.props.tableData2.currentPage,this.props.tableData2.pageSize,this.props.searchText2);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.reloadGrid) {
            //console.log("come in componentWillReceiveProps <<<<<<<<<<");
            this.props.listItems(params,this.props.tableData.currentPage,this.props.tableData.pageSize,this.props.searchText);
            this.props.listItems2(params,this.props.tableData2.currentPage,this.props.tableData2.pageSize,this.props.searchText2);
        }
    }

    addItem(e) {
        let keys=this.props.selectedRowKeys2;
        if(keys.length==0) {
            Modal.warning({
                title: '请选择要添加的用户',
                content: '',
            });
            return;
        }
        let ids = keys.join(",");
        this.props.changeRowKeys2([]);
        this.props.addItem(ids,groupId);
    }

    editItem(id,e) {
    } 

    delItem(e) {
        let _self = this;
        let keys=this.props.selectedRowKeys;
        if(keys.length==0) {
            Modal.warning({
                title: '请选择要删除的用户',
                content: '',
            });
            return;
        }
        confirm({
            title: '确定要删除吗',
            content: '',
            onOk() {
                let ids =  keys.join(",");
                _self.props.changeRowKeys([]);
                _self.props.delItem(ids,groupId,_self.props.tableData);
            },
            onCancel() {},
        });
    } 

    search(e) {
        //console.log(this.refs.searchText.refs.input.value);
        this.props.listItems2(params,1,this.props.tableData2.pageSize,this.props.searchText2);
    }

    handleInputChange(e) {
        this.props.searchChange2(e.target.value);
    }

    handleBack(e){
        this.context.router.replace('/template/user/user_group_list');
    }

    render() {
        let _self = this;
        const tableColumn = [
            {title: '登录名', dataIndex: 'loginName',key:'loginName'},
            {title: '用户名', dataIndex: 'userName',key:'userName'}
        ];
        
        const rowSelection = {
            selectedRowKeys: this.props.selectedRowKeys,
            onChange(selectedRowKeys, selectedRows) {
                //keys=selectedRowKeys;
                _self.props.changeRowKeys(selectedRowKeys);
            }
        };
        const rowSelection2 = {
            selectedRowKeys: this.props.selectedRowKeys2,
            onChange(selectedRowKeys, selectedRows) {
                //keys2=selectedRowKeys;
                _self.props.changeRowKeys2(selectedRowKeys);
            }
        };

        const pagination = {
            total: this.props.tableData.total,
            pageSize: this.props.tableData.pageSize,
            current: this.props.tableData.currentPage,
            //showQuickJumper: true,
            //showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                _self.props.listItems(params,current,pageSize,_self.props.searchText);
            },
            onChange(current) {
                _self.props.listItems(params,current,_self.props.tableData.pageSize,_self.props.searchText);
            },
            //showTotal: () => "共 "+this.props.tableData.total+" 条记录"
        };
        const pagination2 = {
            total: this.props.tableData2.total,
            pageSize: this.props.tableData2.pageSize,
            current: this.props.tableData2.currentPage,
            //showQuickJumper: true,
            //showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                _self.props.listItems2(params,current,pageSize,_self.props.searchText2);
            },
            onChange(current) {
                _self.props.listItems2(params,current,_self.props.tableData2.pageSize,_self.props.searchText2);
            },
            //showTotal: () => "共 "+this.props.tableData.total+" 条记录"
        };

        return (
            <div>
                {/*<h2>用户组</h2>*/}

                <div style={{width:"40%",float:"left"}}>
                    <Button onClick={this.handleBack.bind(this)}>
                        <Icon type="rollback"/>返回
                    </Button><br/><br/>
                    <h2>[{groupName}]选中成员列表</h2>
                    <Table size="small" rowKey="userId" rowSelection={rowSelection} columns={tableColumn} 
                            dataSource={this.props.tableData.items} pagination={pagination} loading={this.props.loading} />
                </div>
                <div style={{marginTop:'100px',width:"10%",float:"left",textAlign:"center"}}>
                    <Button onClick={this.delItem.bind(this)}>
                        <Icon type="right"/>取消
                    </Button><br/><br/>
                    <Button type="primary"   onClick={this.addItem.bind(this)}>
                        <Icon type="left"/>添加
                    </Button>
                </div>
                <div style={{marginTop:'15px',width:"40%",float:"left"}}>
                    <div style={{textAlign:"center"}}>
                        <Input value={this.props.searchText2} style={{width:'150px',marginRight:'10px'}} onChange={this.handleInputChange.bind(this)}
                            onPressEnter={this.search.bind(this)} placeholder="请输入关键词" />
                        <Button type="primary" shape="circle">
                            <Icon type="search" onClick={this.search.bind(this)} />
                        </Button>
                    </div>
                    <h2>用户列表</h2>
                    <Table size="small" rowKey="userId" rowSelection={rowSelection2} columns={tableColumn} 
                            dataSource={this.props.tableData2.items} pagination={pagination2} loading={this.props.loading2} />
                </div>
            </div>

        )
    }
    
}

SetUserGroup.contextTypes = contextTypes;

function mapStateToProps(state) {
    return {
        tableData:state.user_group_member.tableData,
        reloadGrid: state.user_group_member.reloadGrid,
        loading: state.user_group_member.loading,
        searchText: state.user_group_member.searchText,
        selectedRowKeys: state.user_group_member.selectedRowKeys,
        tableData2:state.user_group_member.tableData2,
        reloadGrid2: state.user_group_member.reloadGrid2,
        loading2: state.user_group_member.loading2,
        searchText2: state.user_group_member.searchText2,
        selectedRowKeys2: state.user_group_member.selectedRowKeys2
    }
    
}
function mapDispatchToProps(dispatch) {
    return {
        listItems:bindActionCreators(listItems,dispatch),
        listItems2:bindActionCreators(listItems2,dispatch),
        delItem:bindActionCreators(delItem,dispatch),
        searchChange2:bindActionCreators(searchChange2,dispatch),
        addItem:bindActionCreators(addItem,dispatch),
        changeRowKeys:bindActionCreators(changeRowKeys,dispatch),
        changeRowKeys2:bindActionCreators(changeRowKeys2,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SetUserGroup)


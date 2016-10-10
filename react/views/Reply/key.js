import React, {PropTypes} from 'react'
import {Tabs, Input, Button, Icon, Table} from 'antd';
const TabPane = Tabs.TabPane;

const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

//---------------------table---------------------------

// 通过 rowSelection 对象表明需要行选择
const rowSelection = {
    onChange(selectedRowKeys, selectedRows) {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect(record, selected, selectedRows) {
        console.log(record, selected, selectedRows);
    },
    onSelectAll(selected, selectedRows, changeRows) {
        console.log(selected, selectedRows, changeRows);
    }
};

const tableColumn = [
    {title: 'ID', dataIndex: 'id'},
    {title: '关键词', dataIndex: 'key'},
    {title: '回复内容', dataIndex: 'msg'},
    {title: '管理', dataIndex: 'admin'}
];

const tableData = [


    {id: 7, key: 'ssd', msg: '这是固态硬盘的最新资讯', admin: '删除'},
    {id: 6, key: 'ssd2', msg: '这是固态硬盘的最新资讯', admin: '删除'},
    {id: 5, key: 'ssd3', msg: '这是固态硬盘的最新资讯', admin: '删除'},
    {id: 4, key: 'ssd4', msg: '这是固态硬盘的最新资讯', admin: '删除'},
    {id: 3, key: 'ssd5', msg: '这是固态硬盘的最新资讯', admin: '删除'},
    {id: 2, key: 'ssd6', msg: '这是固态硬盘的最新资讯', admin: '删除'},
    {id: 1, key: 'ssd7', msg: '这是固态硬盘的最新资讯', admin: '删除'}

];
//---------------------table---------------------------


class Reply extends React.Component {

    constructor(props) {
        super(props)
    }

    handleTab(e) {
        console.log(e)

        if (e == 1) {
            this.context.router.replace('/reply')
        }

        if (e == 2) {
            this.context.router.replace('/reply/auto')
        }

        if (e == 3) {
            this.context.router.replace('/reply/key')
        }
    }


    render() {

        return (
            <div>

                <Tabs defaultActiveKey="3" type="card" onChange={this.handleTab.bind(this)}>
                    <TabPane tab="被关注后自动回复" key="1">

                    </TabPane>
                    <TabPane tab="消息自动回复" key="2"></TabPane>
                    <TabPane tab="关键词自动回复" key="3">
                        <Button type="primary" size="large">
                            <Icon type="plus"/>
                            新建自动回复规则
                        </Button>

                        <div style={{marginTop:'10px'}}>
                            <Table rowSelection={rowSelection} columns={tableColumn} dataSource={tableData}/>
                        </div>

                    </TabPane>
                </Tabs>

            </div>

        )
    }
}

Reply.contextTypes = contextTypes;

export default Reply


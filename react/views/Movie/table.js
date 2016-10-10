import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Button, Table, Icon, Modal, Form, Input, Checkbox, Radio, Tooltip, Spin} from 'antd'


import {bindActionCreators} from 'redux'

import {getMovie} from '../../actions/movie'


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
//---------------------table---------------------------


class MTable extends React.Component {


    render() {


        return (
            <div>


                <div style={{margin:'10px 0px'}}>

                    <Button onClick={this.onGetMovie.bind(this)} style={{marginLeft:'0px', marginRight:'10px'}}>
                        <Icon type="menu-unfold"/>
                        获取影片
                    </Button>

                    { this.props.loading == 1 ? (<Spin />) : (<span></span>) }
                    { this.props.loading == 2 ? (<span>加载完毕</span>) : (<span></span>) }


                </div>

                <Table rowSelection={rowSelection} columns={this.props.tableColumn} dataSource={this.props.tableData}/>


            </div>
        )
    }


    onGetMovie() {
        this.props.getMovie()
    }

    componentWillReceiveProps(nextProps) {

        console.log('new movie count=' + nextProps.tableData.length)
        nextProps.tableData.forEach(
            (x, index)=> {
                console.log(index)
                console.log(x)
            }
        )

    }
}

MTable.contextTypes = {
    router: PropTypes.object.isRequired, // 可以通过 this.context.router.replace 进行跳转
    store: PropTypes.object.isRequired
}

//-------------------- 数据和操作的绑定 ----------------------------------------------------

// 将 state 映射到页面中(放到props)
function mapStateToProps(state) {
    console.log("************");
    console.log(state.product.tableData)
    return {
        tableColumn: state.movie.tableColumn,
        tableData: state.movie.tableData,
        loading: state.movie.loading
    }
}

// 将 action 操作映射到页面中(放到props)
function mapDispatchToProps(dispatch) {
    return {
        getMovie: bindActionCreators(getMovie, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MTable)
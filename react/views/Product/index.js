import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {Icon, Input, Button, Select, Table,Spin,Modal} from 'antd';


import {getSeries,getCategory,showBox} from '../../actions/product'


//选择操作，全选，反选
var rowSelection={
    onChange(selectedRowKeys, selectedRows) {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect(record, selected, selectedRows) {
        console.log(record, selected, selectedRows);
    },
    onSelectAll(selected, selectedRows, changeRows) {
        console.log(selected, selectedRows, changeRows);
    }
}


class Product extends React.Component {


    handleChange(value){
        this.props.getSeries(value)
    }

    jumpToProductCate(){
        this.context.router.push('/productCate') // 页面跳转
    }

    render() {
        return (
            <div>
                <h1>product列表</h1>
                <div style={{marginTop:'10px'}}>
                
                    筛选：<Select defaultValue="请选择" style={{width:'120px'}} onChange={this.handleChange.bind(this)}>

                        {

                            this.props.options.map(function(option) {
                                return(  <Option key={option.Id}
                                                 value={option.Id}>{option.Name}</Option>)
                            })
                        }

                    </Select>
                  <Button type="primary"  style={{marginLeft:'20px'}} onClick={this.jumpToProductCate.bind(this)}>  类别管理</Button>
                </div>
                <div style={{marginTop:'10px'}}>

                    <div style={{marginTop:'10px',marginBottom:'10px'}}> <Link to="/addSeries">  <Icon type="plus"/>  添加产品系列</Link></div>


                    <Table  rowSelection={rowSelection} columns={this.props.tableColumn} dataSource={this.props.tableData} >

                    </Table>


                </div>


               
            </div>
        )

    }




    componentDidMount(){
        this.props.getSeries("")
        this.props.getCategory()
    }
    componentWillReceiveProps(nextProps) {

        console.log('new product count=' + nextProps.tableData.length)
        nextProps.tableData.forEach(
            (x, index)=> {
                //console.log(index)
                //console.log(x)
            }

        )

    }
}

//-------------------- 数据和操作的绑定 ----------------------------------------------------
// 将 state 映射到页面中(放到props)
function mapStateToProps(state) {
    return {
        tableColumn: state.product.tableColumn,
        tableData: state.product.tableData,
        loading: state.product.loading,
        options:state.product.options,
        select:state.product.select,
        isShowBox: state.product.isShowBox,

    }
}
// 将 action 操作映射到页面中(放到props)
function mapDispatchToProps(dispatch) {
    return {
        getCategory:bindActionCreators(getCategory,dispatch),
        getSeries: bindActionCreators(getSeries, dispatch),
        showBox:bindActionCreators(showBox,dispatch),

    }
}
Product.contextTypes = {
    router: PropTypes.object.isRequired, // 可以通过 this.context.router.replace 进行跳转
}

 export default connect(mapStateToProps,mapDispatchToProps)(Product)
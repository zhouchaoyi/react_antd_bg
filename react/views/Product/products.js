import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {Icon, Input, Button, Select, Table,Spin,Modal} from 'antd';


import {getProduct,getSeriesNameById} from '../../actions/product'


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


class Products extends React.Component {

    handleBack(e){
        e.preventDefault();
        this.context.router.push('/product') // 页面跳转
    }

    render() {
        return (
            <div>
                <h1>{this.props.params.seriesId}产品列表</h1>

                <div style={{marginTop:'10px'}}>

                    <div style={{marginTop:'10px',marginBottom:'10px'}}>
                        <Button type="ghost"  style={{marginRight:'10px'}} onClick={this.handleBack.bind(this)}>
                            <Icon type="left" />
                            返回
                        </Button>
                        <Link to={{pathname:"/addProduct/"+this.props.params.categoryId+'/'+this.props.params.seriesId}}>
                            <Icon type="plus"/>  添加 <b>{this.props.defaultValue.Name}</b> 产品
                        </Link>
                    </div>


                    <Table  rowSelection={rowSelection} columns={this.props.productColumn} dataSource={this.props.productData} >

                    </Table>


                </div>


               
            </div>
        )

    }

    componentDidMount(){
        this.props.getProduct(this.props.params.seriesId)
        //this.props.params.id 是{id：13} 形式

        //根据seresId获取类别名称
        this.props.getSeriesNameById(this.props.params.seriesId)

    }
    componentWillReceiveProps(nextProps) {



    }
}

//-------------------- 数据和操作的绑定 ----------------------------------------------------
// 将 state 映射到页面中(放到props)
function mapStateToProps(state) {

    return {
        defaultValue:state.product.getPropsValue,
        productColumn: state.product.productColumn,
        productData: state.product.productData,
    }
}
// 将 action 操作映射到页面中(放到props)
function mapDispatchToProps(dispatch) {
    return {
        getSeriesNameById:bindActionCreators(getSeriesNameById,dispatch),
        getProduct: bindActionCreators(getProduct, dispatch),
    }
}
Products.contextTypes = {
    router: PropTypes.object.isRequired, // 可以通过 this.context.router.replace 进行跳转
}

 export default connect(mapStateToProps,mapDispatchToProps)(Products)
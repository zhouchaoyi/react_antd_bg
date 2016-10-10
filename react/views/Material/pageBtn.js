/**
 * Created by Liya on 2016/5/11.
 */
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon, Input, Button, Select, Table,Spin,Modal} from 'antd';
import {Link} from 'react-router'
const confirm = Modal.confirm;

import {deletePage} from '../../actions/material'

class PageBtn extends React.Component{

    handleDelete(e){
        const props= this.props;
        confirm({
            title: '您是否确认要删除这条数据',
            onOk() {
                props.deletePage(e.key);
            },
            onCancel() {},
        });

    }

        render(){
            return(
                <div>
                    <a onClick={this.handleDelete.bind(this,this.props.pageRecord)}>删除</a>
                    <span className="ant-divider"></span>
                    <Link to={{pathname:"/material/editPage/"+this.props.pageRecord.key}}>修改</Link>






                </div>
            )
        }
}

// 将 state 映射到页面中(放到props)
function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        deletePage:bindActionCreators(deletePage,dispatch),
        //showEditBox:bindActionCreators(showEditBox,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(PageBtn)

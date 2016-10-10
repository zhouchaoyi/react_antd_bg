/**
 * Created by Liya on 2016/5/11.
 */
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon, Input, Button, Select, Table,Spin,Modal} from 'antd';
import {Link} from 'react-router'
const confirm = Modal.confirm;

import {deletePoster} from '../../actions/material'

class PosterBtn extends React.Component{

    handleDelete(e){
        const props= this.props;
        confirm({
            title: '您是否确认要删除这条数据',
            onOk() {
                props.deletePoster(e.key);
            },
            onCancel() {},
        });

    }

        render(){
            return(
                <div>
                    <a onClick={this.handleDelete.bind(this,this.props.posterRecord)}>删除</a>
                    <span className="ant-divider"></span>
                    <Link to={{pathname:"/material/editPoster/"+this.props.posterRecord.key}}>修改</Link>






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
        deletePoster:bindActionCreators(deletePoster,dispatch),
        //showEditBox:bindActionCreators(showEditBox,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(PosterBtn)

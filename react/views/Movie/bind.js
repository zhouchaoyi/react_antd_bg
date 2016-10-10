import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Button, Table, Icon, Modal, Form, Input, Checkbox, Radio, Tooltip} from 'antd'


import {bindActionCreators} from 'redux'

import {updateMsg} from '../../actions/movie'

import './movie.less'


class Bind extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {



        return (
            <div>

                <h2>以下绑定 state 数据</h2>
                <div className="bindContainer">{this.props.title}</div>

                <h2>以下绑定富文本内容:</h2>
                <div className="bindContainer" dangerouslySetInnerHTML={{__html:this.props.content}}></div>

                <h2>以下绑定 action 事件</h2>
                <div className="bindContainer">
                    <div><Button type="primary" onClick={this.onUpdate.bind(this)}>请点击此处</Button></div>
                    <div>{this.props.msg}</div>
                </div>
            </div>
        )
    }

    onUpdate() {
        this.props.updateMsg('这是reducer修改后新msg')
        console.log('更新完毕')
    }
}

Bind.contextTypes = {
    router: PropTypes.object.isRequired, // 可以通过 this.context.router.replace 进行跳转
    store: PropTypes.object.isRequired
}

//-------------------- 数据和操作的绑定 ----------------------------------------------------

// 将 state 映射到页面中(放到props)
function mapStateToProps(state) {
    console.log(state)
    return {
        title: '这是默认文章标题',
        content: '这是文章内容<strong style="color:red">富文本xx部分zz</strong>',
        msg: state.movie.msg,
    }
}

// 将 action 操作映射到页面中(放到props)
function mapDispatchToProps(dispatch) {
    return {
        updateMsg: bindActionCreators(updateMsg, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bind)
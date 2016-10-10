import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Button, Table, Icon, Modal, Form, Input, Checkbox, Radio, Tooltip} from 'antd'


import {bindActionCreators} from 'redux'

import {showBox} from '../../actions/movie'

import AddUserForm from './addUser'


class Box extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {

        return (
            <div>

                <div style={{margin:'10px 0px'}}>
                    <Button type="primary" onClick={this.onShowBox.bind(this)}>
                        <Icon type="plus"/>
                        添加信息
                    </Button>
                </div>

                <Modal title="添加文章" visible={this.props.isShowBox} onOk={this.handleOk.bind(this)}
                       onCancel={this.handleCancel.bind(this)}>

                    <AddUserForm></AddUserForm>

                </Modal>


            </div>
        )
    }

    onShowBox() {
        this.props.showBox(true)
    }

    handleOk() {
        this.props.showBox(false)
    }

    handleCancel() {
        this.props.showBox(false)
    }

}

Box.contextTypes = {
    router: PropTypes.object.isRequired, // 可以通过 this.context.router.replace 进行跳转
    store: PropTypes.object.isRequired
}

//-------------------- 数据和操作的绑定 ----------------------------------------------------

// 将 state 映射到页面中(放到props)
function mapStateToProps(state) {
    console.log(state)

    return {
        isShowBox: state.movie.isShowBox
    }
}

// 将 action 操作映射到页面中(放到props)
function mapDispatchToProps(dispatch) {
    return {
        showBox: bindActionCreators(showBox, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Box)
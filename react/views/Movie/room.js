import React, {PropTypes} from 'react'
import {Button, Icon} from 'antd'
import {Link} from 'react-router'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {edit} from '../../actions/room'


class Room extends React.Component {


    render() {


        return (
            <div>
                <h2>room 房间</h2>

                <div>{this.props.title} xxxx yyyy</div>

                <div>
                    <button onClick={this.props.myedit.bind(this)}>请点击我</button>
                </div>
            </div>
        )
    }


}



// 将 state 映射到页面中(放到props)
function mapStateToProps(state) {
    console.log(state)
    return {
        title: state.room.title

    }
}


// 将 action 操作映射到页面中(放到props)
function mapDispatchToProps(dispatch) {
    return {
        myedit: bindActionCreators(edit, dispatch)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Room)

// export default Room
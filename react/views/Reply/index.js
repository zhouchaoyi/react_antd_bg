import React, {PropTypes} from 'react'
import {Tabs, Input, Button} from 'antd';
const TabPane = Tabs.TabPane;

const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

class Reply extends React.Component {

    constructor(props) {
        super(props)
    }




    render() {

        return (
            <div>
                <h1 style={{marginBottom:'10px'}}>微信自动回复</h1>

                {this.props.children}

            </div>

        )
    }
}

Reply.contextTypes = contextTypes;

export default Reply


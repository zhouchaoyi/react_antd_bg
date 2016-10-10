import React, {PropTypes} from 'react'
import {Tabs, Input, Button,Icon} from 'antd';
const TabPane = Tabs.TabPane;

const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

class Reply extends React.Component {

    constructor(props) {
        super(props)
    }

    handleTab(e) {
        console.log(e)

        if( e==1) {
            this.context.router.replace('/reply')
        }

        if( e==2) {
            this.context.router.replace('/reply/auto')
        }

        if( e==3) {
            this.context.router.replace('/reply/key')
        }
    }


    render() {

        return (
            <div>

                <Tabs defaultActiveKey="2" type="card" onChange={this.handleTab.bind(this)}>
                    <TabPane tab="被关注后自动回复" key="1">

                    </TabPane>
                    <TabPane tab="消息自动回复" key="2">
                        <Input type="textarea" id="control-textarea" rows="10" placeholder="此处填写回复的内容" />
                        <Button type="primary" htmlType="submit" style={{marginTop:'10px'}}>
                            <Icon type="edit" />
                            设置自动回复内容
                        </Button>
                    </TabPane>
                    <TabPane tab="关键词自动回复" key="3"></TabPane>
                </Tabs>

            </div>

        )
    }
}

Reply.contextTypes = contextTypes;

export default Reply


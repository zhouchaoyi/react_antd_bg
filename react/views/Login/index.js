import React, {PropTypes} from 'react'
import {Form, Input, Button, Row, Col, notification} from 'antd'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {login} from '../../actions/user'

const FormItem = Form.Item

import './index.less'

const propTypes = {
    user: PropTypes.string,
    loggingIn: PropTypes.bool
    //,loginErrors: PropTypes.string
};

const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

class Login extends React.Component {

    constructor(props) {
        super(props)
    }

    componentWillReceiveProps(nextProps) {
        //console.log(nextProps);
        const error = nextProps.loginErrors;
        const isLoggingIn = nextProps.loggingIn;
        const user = nextProps.user

        console.log("error="+error+"<<<<<<<111");
        //console.log("this.props.loginErrors="+this.props.loginErrors);
        // if(error != this.props.loginErrors && error && error.errorCode!='000000') {
        //     notification.error({
        //         message: 'Login Fail',
        //         description: error.errorMsg
        //     });
        //     return;
        // }

        // if (error != this.props.loginErrors && error) {
        //     notification.error({
        //         message: 'Login Fail',
        //         description: error
        //     });
        // }

        if (!isLoggingIn && user) {
            notification.success({
                message: 'Login Success',
                description: 'Welcome ' + user
            });

        }

        if (user) {
            this.context.router.replace('/home');
        }
    }

    handleSubmit(e) {
        e.preventDefault()
        this.props.form.validateFields((errors,value)=> {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            } else {
                const data = this.props.form.getFieldsValue()
                console.log(data);
                this.props.login(data.user, data.password) // 传递给父组件的函数调用
            }

        })

    }

    render() {
        const {getFieldDecorator, getFieldError, isFieldValidating} =this.props.form
        const formItemLayout={
            labelCol:{span:6},
            wrapperCol:{span:12}
        }
        
        return (
            <Row className="login-row" type="flex" justify="space-around">
                <Col span="8">
                    <h1 className="login-title">后台管理系统</h1>
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)} className="login-form">
                        <FormItem
                            label='用户名'
                            {...formItemLayout}
                            hasFeedback
                            validateStatus={this.props.validateStatus.name}
                            required
                            help={isFieldValidating('user')?'校验中...':(getFieldError('user') || []).join(',')}
                        >
                            {getFieldDecorator("user",{
                                rules: [
                                    { required: true, min: 1, message: '请输入用户名' }
                                ],
                                onChange: (e) => {
                                    const value=e.target.value;
                                    if(value.length<1){
                                        this.props.validateStatus.name="error"
                                    }else{
                                        this.props.validateStatus.name="success"
                                    }
                                }
                            })(
                                <Input placeholder='用户名'  />
                            )}
                        </FormItem>
                        <FormItem
                            label='密码'
                            {...formItemLayout}
                            hasFeedback
                            validateStatus={this.props.validateStatus.pwd}
                            required
                        >
                            {getFieldDecorator("password",{
                                rules: [
                                    { required: true, min: 1, message: '请输入密码' }
                                ],
                                onChange: (e) => {
                                    const value=e.target.value;
                                    if(value.length<1){
                                        this.props.validateStatus.pwd="error"
                                    }else{
                                        this.props.validateStatus.pwd="success"
                                    }
                                }
                            })(
                                <Input type='password' placeholder='密码' />
                            )}
                        </FormItem>


                        <Row>
                            <Col span='16' offset='10'>
                                <Button type='primary' htmlType='submit'>登录系统</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>

        )
    }
}

Login.contextTypes = contextTypes;

Login.propTypes = propTypes;

Login = Form.create()(Login);

function mapStateToProps(state) {
    const {user} = state;
    console.log("user",user)
    if (user.user) {
        return {
            user: user.user,
            loggingIn: user.loggingIn,
            loginErrors: '',
            validateStatus:user.validateStatus
        };
    }

    return {user: null, loggingIn: user.loggingIn, loginErrors: user.loginErrors, validateStatus:user.validateStatus,};
}

function mapDispatchToProps(dispatch) {
    return {
        login: bindActionCreators(login, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

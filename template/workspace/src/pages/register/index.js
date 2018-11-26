import React, { Component } from 'react';
import Page from 'components/page';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form } from 'torenia';

import styles from './index.css';

class Register extends Component {
  constructor(props) {
    super(props);
  }

  get registerFormConfig() {
    const { dispatch } = this.props;
    return {
      fields: [
        { name: 'phone', placeholder: '手机号', widget: 'SmsCode' },
        { name: 'smsCode', placeholder: '短信验证码' },
        { name: 'password', placeholder: '密码', widget: 'Password' },
        {
          name: 'confirmPassword',
          placeholder: '确认密码',
          widget: 'Password',
        },
      ],
      className: styles.registerForm,
      opProps: {
        wrapperCol: { offset: 0 },
        className: styles.registerFormBtn,
      },
      submitText: '注册',
      onSubmit(values) {
        dispatch({
          type: 'register/register',
          payload: values,
        });
      },
    };
  }

  render() {
    const {
      register: { success },
    } = this.props;
    return (
      <Page>
        {success ? (
          <div style={{ textAlign: 'center', marginTop: 50 }}>
            注册成功，请前往登录页<Link to="/login">登录</Link>
          </div>
        ) : (
          <Form {...this.registerFormConfig} />
        )}
      </Page>
    );
  }
}

export default connect(({ register }) => ({ register }))(Register);

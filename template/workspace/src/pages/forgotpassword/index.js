import { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Steps } from 'antd';
import Page from 'components/page';
import { Form } from 'torenia';

import styles from './index.css';

const { Step } = Steps;

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
  }

  get validateInfoFormConfig() {
    const { dispatch } = this.props;
    return {
      fields: [{ name: 'phone', placeholder: '请输入手机号' }],
      submitText: '获取验证码',
      opProps: {
        wrapperCol: { offset: 0 },
      },
      onSubmit(values) {
        dispatch({
          type: 'forgotpassword/validateInfo',
          payload: values,
        });
      },
    };
  }
  get resetPasswordFormConfig() {
    const { dispatch } = this.props;
    return {
      fields: [
        { name: 'password', placeholder: '请输入密码', widget: 'Password' },
        {
          name: 'confirmPassword',
          placeholder: '请再次输入密码',
          widget: 'Password',
        },
        { name: 'smsCode', placeholder: '请输入短信验证码' },
      ],
      submitText: '确认修改',
      opProps: {
        wrapperCol: { offset: 0 },
      },
      onSubmit(values) {
        dispatch({
          type: 'forgotpassword/resetPassword',
          payload: values,
        });
      },
    };
  }

  get stepContent() {
    return [
      <div className={styles.validateInfoForm}>
        <Form {...this.validateInfoFormConfig}>submit</Form>
      </div>,
      <div className={styles.resetPasswordForm}>
        <Form {...this.resetPasswordFormConfig}>submit</Form>
      </div>,
      <div style={{ marginTop: 50, textAlign: 'center' }}>
        修改成功,请
        <Link to="/login">重新登录</Link>
      </div>,
    ];
  }

  render() {
    const { current: currentStep } = this.props.forgotpassword;
    return (
      <Page>
        <div className={styles.forgotpassword}>
          <Steps labelPlacement="vertical" current={currentStep}>
            <Step key="1" title="验证信息" />
            <Step key="2" title="设置密码" />
            <Step key="3" title="重新登录" />
          </Steps>
          <div>{this.stepContent[currentStep]}</div>
        </div>
      </Page>
    );
  }
}

export default connect(({ forgotpassword }) => ({ forgotpassword }))(
  ForgotPassword,
);

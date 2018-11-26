import { Component } from 'react';
import { Form } from 'torenia';
import { connect } from 'dva';
import { Link } from 'dva/router';
import Page from 'components/page';
import { Icon, Row, Col } from 'antd';

import styles from './index.css';

class Login extends Component {
  constructor(props) {
    super(props);
  }

  get formOption() {
    const { dispatch } = this.props;
    return {
      fields: [
        { name: 'username', prefix: <Icon type="user" /> },
        {
          name: 'password',
          widget: 'Password',
          prefix: <Icon type="safety" />,
        },
      ],
      submitText: '登录',
      opProps: {
        wrapperCol: { offset: 0 },
      },
      onSubmit(values) {
        dispatch({
          type: 'session/login',
          payload: values,
        });
      },
    };
  }

  render() {
    return (
      <Page className={styles.background}>
        <div className={styles.formWrapper}>
          <Form {...this.formOption}>
            submit
            <Row type="flex">
              <Col style={{ flex: 1 }}>
                <Link to="/forgotpassword">忘记密码</Link>
              </Col>
              <Col style={{ flex: 1, textAlign: 'right' }}>
                <Link to="/register">没有账户</Link>
              </Col>
            </Row>
          </Form>
        </div>
      </Page>
    );
  }
}

export default connect(({ session }) => ({ session }))(Login);

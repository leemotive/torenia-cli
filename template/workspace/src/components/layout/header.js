import React, { Component } from 'react';
import { Layout, Menu, Icon, Dropdown } from 'antd';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import Notice from 'components/notice';

const { Header: AntHeader } = Layout;

import styles from './header.css';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  onMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if ('logout' === key) {
      dispatch({
        type: 'session/logout',
      });
    }
  };

  render() {
    const { app } = this.props;

    return (
      <AntHeader style={{ background: '#fff', padding: 0, display: 'flex' }}>
        <div style={{ flex: 1 }} />
        <Notice to="/inmail" count={99} />
        <Dropdown
          overlay={
            <Menu
              className="header-item"
              style={{ lineHeight: '64px' }}
              onClick={this.onMenuClick}
            >
              <Menu.Item key="logout">Sign out</Menu.Item>
            </Menu>
          }
        >
          <span className={styles.avatar}>
            <Icon type="user" />
            {app.userInfo.username}
          </span>
        </Dropdown>
      </AntHeader>
    );
  }
}

export default withRouter(
  connect(({ app, loading }) => ({ app, loading }))(Header),
);

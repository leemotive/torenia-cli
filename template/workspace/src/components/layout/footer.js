import React, { Component } from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AntFooter style={{ textAlign: 'center', padding: '15px' }}>
        大用户中心系统
      </AntFooter>
    );
  }
}

export default Footer;

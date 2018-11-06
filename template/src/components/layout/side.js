import React, { Component } from 'react';
import { Layout, Icon } from 'antd';
import Menu from './menu';

const { Sider: AntSider } = Layout;

class Sider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    };
  }

  onCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    const { collapsed } = this.state;
    return (
      <AntSider
        style={{ height: '100vh', overflow: 'auto' }}
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
      >
        <div
          style={{
            color: 'white',
            fontSize: '20px',
            padding: '10px 0',
            textAlign: 'center',
          }}

        >用户中心</div>
        <Menu collapsed={collapsed} />
      </AntSider>
    );
  }

}

export default Sider;

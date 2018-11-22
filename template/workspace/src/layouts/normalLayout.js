import React, { Component } from 'react';
import { Layout, BackTop } from 'antd';
import Sider from 'components/layout/side';
import Header from 'components/layout/header';
import Footer from 'components/layout/footer';

const { Content } = Layout;

class NormalLayout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, ...props } = this.props;
    return (
      <div>
        <Layout>
          <Sider {...props} />
          <Layout id="scrollContainer" style={{ height: '100vh', overflow: 'auto' }}>
            <Header />
            <Content style={{ margin: '15px 15px 0', padding: '15px 15px 0', background: '#fff', minHeight: 'auto' }}>
              {children}
            </Content>
            <Footer />
          </Layout>
          <BackTop target={() => document.getElementById('scrollContainer')} />
        </Layout>
      </div>
    )
  }
}

export default NormalLayout;

import React from 'react';
import { Layout } from 'antd';
import { Helmet } from 'react-helmet';
import Sider from 'components/layout/side';
import Header from 'components/layout/header';
import Footer from 'components/layout/footer';

const { Content } = Layout;

const NormalLayout = props => {
  const { children } = props;
  return (
    <div>
      <Helmet>
        <title>用户中心</title>
      </Helmet>
      <Layout>
        <Sider { ...props } />
        <Layout style={{ height: '100vh', overflow: 'auto' }}>
          <Header />
          <Content style={{ margin: '15px 15px 0', padding: '15px 15px 0', background: '#fff', minHeight: 'auto' }}>
            {children}
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </div>
  )
}

export default NormalLayout;

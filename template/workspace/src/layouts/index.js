import React from 'react';
import { LocaleProvider } from 'antd';
import enUS from 'antd/es/locale-provider/en_US';
import { withRouter } from 'react-router-dom';
import Layout from './layout';

export default withRouter(props => {
  return (
    <LocaleProvider locale={enUS}>
      <Layout>{props.children}</Layout>
    </LocaleProvider>
  );
});

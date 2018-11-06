import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { BackTop } from 'antd';
import { withRouter } from 'dva/router';
import config from 'utils/config';
import EmptyLayout from './emptyLayout';
import NormalLayout from './normalLayout';

const { emptyLayoutPages = [] } = config;

let lastPathname;

const Layout = (props) => {
  const { children, dispatch, app, loading, location } = props;

  let { pathname } = location;
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  let PageLayout = NormalLayout;
  if (emptyLayoutPages.includes(pathname)) {
    PageLayout = EmptyLayout;
  }

  return (
    <PageLayout { ...props }  >
      <BackTop target={() => document.getElementById('root')} />
      {children}
    </PageLayout>
  )
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
};

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(Layout))

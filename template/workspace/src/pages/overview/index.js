import { Component } from 'react';
import { connect } from 'dva';

import Page from 'components/page';

class Overview extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page>
        概览页面
      </Page>
    )
  }
}


export default connect(({ overview }) => ({ overview }))(Overview);

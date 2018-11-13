import { Component } from 'react';
import Page from 'components/page';
import { Table } from 'torenia';

import column from './components/column';

class TableList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page>
        <Table
          resource="list"
          name="demolist"
          columns={column()}
        />
      </Page>
    )
  }
}

export default TableList;

import { Component } from 'react';
import Page from 'components/page';

import column from './components/column';

class TableList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page>
        <TableList
          resource="list"
          name="demolist"
          columns={column()}
        />
      </Page>
    )
  }
}

export default TableList;

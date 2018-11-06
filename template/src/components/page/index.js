import React, { Component } from 'react';

class Page extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div { ...this.props } >
        { this.props.children }
      </div>
    )
  }
}

export default Page;

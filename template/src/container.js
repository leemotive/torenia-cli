import React, { Component } from 'react';
import dva from 'dva';
import createLoading from 'dva-loading';

const app = dva({
  history: window.g_history,
});

window.g_app = app;

app.use(createLoading());

// models start

// models end

class Container extends Component {
  render() {
    app.router(() => this.props.children);
    return app.start()();
  }
}

export default Container;


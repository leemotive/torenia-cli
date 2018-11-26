import './global.js';
import React from 'react';
import ReactDOM from 'react-dom';

import Routes from './router';
import Container from './container';

function render() {
  ReactDOM.render(
    <Container>
      <Routes />
    </Container>,
    document.getElementById('root'),
  );
}

render();

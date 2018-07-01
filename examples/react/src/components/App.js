import React from 'react';
import { Router } from '@reach/router';

import Home from './Home';
import Contact from './Contact';

export default class App extends React.PureComponent {
  render() {
    return (
      <Router>
        <Home path="/" />
        <Contact path="/contact" />
      </Router>
    );
  }
}

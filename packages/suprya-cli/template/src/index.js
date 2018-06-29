import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Link } from '@reach/router';

const Home = () => <div>Home</div>;
const Contact = () => <div>Contact</div>;

ReactDOM.render(
  <Router>
    <Home path="/" />
    <Contact path="/contact" />
  </Router>,
  document.getElementById('root')
);

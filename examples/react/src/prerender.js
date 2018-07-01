import React from 'react';
import { renderToString } from 'react-dom/server';

import App from './components/App';

export default () => renderToString(<App />);

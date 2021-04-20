import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import AuthContextProvider from './context/auth-contex';

const app = (
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);

ReactDOM.render(app, document.getElementById('root'));

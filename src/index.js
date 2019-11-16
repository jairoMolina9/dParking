import React from 'react'
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './App.js';

// Require Sass file so webpack can build it
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import'./styles/style.css';

// antd
import 'antd/dist/antd.css';

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));

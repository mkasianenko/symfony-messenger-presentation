require('../css/app.css');

import React from 'react';
import { render } from 'react-dom';
import { store_factory } from './Store/store_factory';
import ApiClient from './Api/ApiClient.js';

import App from './Components/App.jsx';

const store = store_factory();
const apiClient = new ApiClient('http://0.0.0.0:3000');

render(<App store={store} apiClient={apiClient}/>, document.getElementById('app'));
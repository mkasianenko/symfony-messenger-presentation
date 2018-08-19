require('../css/app.css');

import React from "react";
import { render } from "react-dom";

import App from './App.jsx';
import ApiClient from './ApiClient.js';

const apiClient = new ApiClient('http://0.0.0.0:3000');

render(<App apiClient={apiClient}/>, document.getElementById('app'));
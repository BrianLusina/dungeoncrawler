import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import './styles/index.css';
import configureStore from './store/configureStore';

//initialize store
const store = configureStore();


ReactDOM.render(
  <App />,
  document.getElementById('root')
);

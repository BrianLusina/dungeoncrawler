import React from 'react';
import { render } from 'react-dom';
import App from './containers/App';
import './styles/sass/index.css';

// Entry point of the application. This will render the application to the DOM.
render(
    <App />,
    document.getElementById('root')
);

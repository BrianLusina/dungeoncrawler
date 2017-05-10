import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './containers/App';
import configureStore from './store/configureStore';
import './styles/sass/index.css';

// initialize store
const store = configureStore();

// Entry point of the application. This will render the application to the DOM.
//    <Provider store={createStoreWithMiddleware(enableBatching(reducers))}>
console.log(store);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom';
import App from '../src/containers/App';

//todo implement this after all other tests pass
xit('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

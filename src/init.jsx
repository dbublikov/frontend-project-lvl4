import React from 'react';
import { Provider } from 'react-redux';
import store from './store.js';
import App from './components/App.jsx';

export default function () {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

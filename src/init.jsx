import React from 'react';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import store from './store.js';
import App from './components/App.jsx';

export default function () {
  const socket = io();

  return (
    <Provider store={store}>
      <App socket={socket} />
    </Provider>
  );
}

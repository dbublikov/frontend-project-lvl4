import React from 'react';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import store from './store.js';
import App from './App.jsx';
import resources from './locales/index.js';
import { addChannel, removeChannel, renameChannel } from './slices/channelsInfoSlice.js';
import { addMessage } from './slices/messagesInfoSlice.js';

const init = async (socketClient = io()) => {
  const i18nInstance = i18n.createInstance();
  const lng = localStorage.getItem('lang') || 'ru';

  await i18nInstance
    .use(initReactI18next)
    .init({
      lng,
      resources,
    });

  const socket = socketClient;

  socket.on('newMessage', (message) => {
    store.dispatch(addMessage({ message }));
  });

  socket.on('newChannel', (channel) => {
    store.dispatch(addChannel({ channel }));
  });

  socket.on('removeChannel', ({ id }) => {
    store.dispatch(removeChannel({ id }));
  });

  socket.on('renameChannel', ({ id, name }) => {
    store.dispatch(renameChannel({ id, name }));
  });

  return (
    <Provider store={store}>
      <App socket={socket} />
    </Provider>
  );
};

export default init;

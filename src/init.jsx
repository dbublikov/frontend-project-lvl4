import React from 'react';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import store from './store.js';
import App from './components/App.jsx';
import resources from './locales/index.js';

export default async () => {
  const socket = io();

  const i18nInstance = i18n.createInstance();
  const lng = localStorage.getItem('lang') || 'ru';

  await i18nInstance
    .use(initReactI18next)
    .init({
      lng,
      resources,
    });

  return (
    <Provider store={store}>
      <App socket={socket} />
    </Provider>
  );
};

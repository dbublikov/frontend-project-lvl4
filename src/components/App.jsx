/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import authContext from '../contexts/index.js';
import useAuth from '../hooks/index.js';
import getModal from './modals/index.js';

import AppNavbar from './AppNavbar';
import Chat from './Chat';
import Login from './Login';
import SignUp from './SignUp';
import NotFound from './NotFound';
import { addMessage } from '../slices/messagesInfoSlice.js';
import { addChannel, removeChannel, renameChannel } from '../slices/channelsInfoSlice.js';
import { closeModal } from '../slices/modalSlice.js';

const renderModal = (type, socket, onExited) => {
  if (!type) {
    return null;
  }

  const Modal = getModal(type);

  return <Modal onExited={onExited} socket={socket} />;
};

function AuthProvider({ children }) {
  const userId = JSON.parse(localStorage.getItem('userId'));
  const [loggedIn, setLoggedIn] = useState(userId && userId.token);
  console.log(localStorage);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </authContext.Provider>
  );
}

function PrivateRoute({ children, path, exact }) {
  const auth = useAuth();

  return (
    <Route
      path={path}
      exact={exact}
      render={() => (auth.loggedIn
        ? children
        : <Redirect to="/login" />)}
    />
  );
}

function App({ socket }) {
  const { type } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const onModalExited = () => {
    dispatch(closeModal());
  };

  useEffect(() => {
    socket.on('newMessage', (message) => {
      dispatch(addMessage({ message }));
    });
    socket.on('newChannel', (channel) => {
      dispatch(addChannel({ channel }));
    });
    socket.on('removeChannel', ({ id }) => {
      dispatch(removeChannel({ id }));
    });
    socket.on('renameChannel', ({ id, name }) => {
      dispatch(renameChannel({ id, name }));
    });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column h-100">
          <AppNavbar />
          <Switch>
            <PrivateRoute exact path="/">
              <Chat socket={socket} />
            </PrivateRoute>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
        {renderModal(type, socket, onModalExited)}
      </Router>
    </AuthProvider>
  );
}

export default App;

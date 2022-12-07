/* eslint-disable import/no-unresolved */
import React, { useState, useMemo } from 'react';
import {
  BrowserRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import { authContext, socketContext } from './contexts/index.js';
import { useAuth } from './hooks/index.js';
import getModal from './components/modals/index.js';

import AppNavbar from './components/AppNavbar';
import Chat from './components/Chat';
import Login from './components/Login';
import SignUp from './components/SignUp';
import NotFound from './components/NotFound';
import { closeModal } from './slices/modalSlice.js';

const renderModal = (type, onExited) => {
  if (!type) {
    return null;
  }

  const Modal = getModal(type);

  return <Modal onExited={onExited} />;
};

const AuthProvider = ({ children }) => {
  const userToken = localStorage.getItem('token');
  const [loggedIn, setLoggedIn] = useState(!!userToken);

  // console.log(localStorage);

  const logIn = ({ token, username }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setLoggedIn(true);
  };

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setLoggedIn(false);
  };

  const value = useMemo(() => ({ loggedIn, logIn, logOut }), [loggedIn]);

  return (
    <authContext.Provider value={value}>
      {children}
    </authContext.Provider>
  );
};

const PrivateRoute = ({ children, exact, path }) => {
  const { loggedIn } = useAuth();

  return (
    <Route exact={exact} path={path}>
      {loggedIn ? children : <Redirect to="/login" />}
    </Route>
  );
};

const App = ({ socket }) => {
  const { type } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const onModalExited = () => {
    dispatch(closeModal());
  };

  return (
    <AuthProvider>
      <socketContext.Provider value={socket}>
        <Router>
          <div className="d-flex flex-column h-100">
            <AppNavbar />
            <ToastContainer autoClose={3000} />

            <Switch>
              <PrivateRoute exact path="/">
                <Chat />
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
          {renderModal(type, onModalExited)}
        </Router>
      </socketContext.Provider>
    </AuthProvider>
  );
};

export default App;

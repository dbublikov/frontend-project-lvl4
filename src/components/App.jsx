/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  BrowserRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { authContext, socketContext } from '../contexts/index.js';
import { useAuth } from '../hooks/index.js';
import getModal from './modals/index.js';

import AppNavbar from './AppNavbar';
import Chat from './Chat';
import Login from './Login';
import SignUp from './SignUp';
import NotFound from './NotFound';
import { closeModal } from '../slices/modalSlice.js';

const renderModal = (type, onExited) => {
  if (!type) {
    return null;
  }

  const Modal = getModal(type);

  return <Modal onExited={onExited} />;
};

const AuthProvider = ({ children }) => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  const [loggedIn, setLoggedIn] = useState(userId && userId.token);
  console.log(localStorage);

  const logIn = (authData) => {
    localStorage.setItem('userId', JSON.stringify(authData));
    setLoggedIn(true);
  };
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </authContext.Provider>
  );
};

const PrivateRoute = ({ children, path, exact }) => {
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
          {renderModal(type, onModalExited)}
        </Router>
      </socketContext.Provider>
    </AuthProvider>
  );
};

export default App;

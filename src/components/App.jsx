/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  BrowserRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';
import authContext from '../contexts/index.js';
import useAuth from '../hooks/index.js';

import AppNavbar from './AppNavbar';
import Chat from './Chat';
import Login from './Login';
import SignUp from './SignUp';
import NotFound from './NotFound';

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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column h-100">
          <AppNavbar />
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
      </Router>
    </AuthProvider>
  );
}

export default App;

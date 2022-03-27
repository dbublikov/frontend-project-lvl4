/* eslint-disable import/no-unresolved */
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import Home from './Home';
import Login from './Login';
import SignUp from './SignUp.jsx';
import NotFound from './NotFound';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column h-100">
        <AppNavbar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
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
  );
}

export default App;

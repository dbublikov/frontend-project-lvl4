/* eslint-disable import/no-unresolved */
import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import axios from 'axios';

import useAuth from '../hooks/index.js';
import routes from '../routes.js';
import FormContainer from './FormContainer';

function Login() {
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);

  const usernameRef = useRef();
  const history = useHistory();

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  // continues from here !!!

  const handleSubmit = async (values) => {
    const url = routes.login();

    setAuthFailed(false);

    try {
      const res = await axios.post(url, { ...values });

      localStorage.setItem('userId', JSON.stringify(res.data));
      auth.logIn();

      history.push('/');
    } catch (e) {
      if (e.isAxiosError && e.response.status === 401) {
        setAuthFailed(true);
        usernameRef.current.select();
        return;
      }
      throw e;
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: handleSubmit,
  });

  if (auth.loggedIn) {
    history.push('/');
  }

  return (
    <FormContainer>
      <Form className="p-3" onSubmit={formik.handleSubmit}>
        <Form.Group>
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            name="username"
            id="username"
            autoComplete="username"
            required
            type="text"
            onChange={formik.handleChange}
            value={formik.values.username}
            ref={usernameRef}
            isInvalid={authFailed}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            name="password"
            id="password"
            autoComplete="current-password"
            required
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            isInvalid={authFailed}
          />
          {authFailed
            && <Form.Control.Feedback type="invalid">Authentication failed!</Form.Control.Feedback>}
        </Form.Group>
        <Button
          type="submit"
          variant="outline-primary"
          className="w-100 mb-3"
        >
          Sign in
        </Button>
        <div className="text-center">
          <span>
            Нет аккаунта?
            &nbsp;
            <Link to="/signup">Регистрация</Link>
          </span>
        </div>
      </Form>
    </FormContainer>
  );
}

export default Login;

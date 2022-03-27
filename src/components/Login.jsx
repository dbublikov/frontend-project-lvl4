/* eslint-disable import/no-unresolved */
import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';

import FormContainer from './FormContainer';

function Login() {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: () => {},
  });

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
          />
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

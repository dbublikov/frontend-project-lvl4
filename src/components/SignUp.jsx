/* eslint-disable import/no-unresolved */
import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';

import useAuth from '../hooks/index.js';
import FormContainer from './FormContainer';

const signUpSchema = yup.object().shape({
  username: yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов'),
  password: yup.string()
    .min(6, 'Не менее 6 символов'),
  confirmPassword: yup.string()
    .oneOf([
      yup.ref('password'),
    ], 'Пароли должны совпадать'),
});

function SignUp() {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signUpSchema,
    onSubmit: () => {},
  });

  const auth = useAuth();
  const history = useHistory();
  const usernameRef = useRef();

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

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
            placeholder="От 3 до 20 символов"
            onChange={formik.handleChange}
            value={formik.values.username}
            isInvalid={formik.errors.username}
            ref={usernameRef}
          />
          {formik.errors.username
            && <Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback>}
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            name="password"
            id="password"
            autoComplete="new-password"
            type="password"
            required
            placeholder="Не менее 6 символов"
            onChange={formik.handleChange}
            value={formik.values.password}
            isInvalid={formik.errors.password}
          />
          {formik.errors.password
            && <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>}
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="confirmPassword">Подтвердите пароль</Form.Label>
          <Form.Control
            name="confirmPassword"
            id="confirmPassword"
            autoComplete="new-password"
            type="password"
            required
            placeholder="Пароли должны совпадать"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            isInvalid={formik.errors.confirmPassword}
          />
          {formik.errors.confirmPassword
            && <Form.Control.Feedback type="invalid">{formik.errors.confirmPassword}</Form.Control.Feedback>}
        </Form.Group>
        <Button type="submit" className="w-100" variant="outline-primary">Sign up</Button>
      </Form>
    </FormContainer>
  );
}

export default SignUp;

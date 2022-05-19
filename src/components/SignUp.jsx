/* eslint-disable import/no-unresolved */
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';

import useAuth from '../hooks/index.js';
import FormContainer from './FormContainer';
import routes from '../routes.js';

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

const SignUp = () => {
  const [signUpFailed, setSignUpFailed] = useState(false);

  const auth = useAuth();
  const history = useHistory();
  const usernameRef = useRef();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signUpSchema,
    onSubmit: async ({ username, password }, { setSubmitting }) => {
      setSubmitting(true);

      const url = routes.signup();

      try {
        const res = await axios.post(url, { username, password });
        auth.logIn(res.data);

        history.push('/');
      } catch (e) {
        if (e.isAxiosError && e.response.status === 409) {
          setSubmitting(false);
          setSignUpFailed(true);
          return;
        }

        throw e;
      }
    },
  });

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
            isInvalid={formik.errors.username || signUpFailed}
            readOnly={formik.isSubmitting}
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
            isInvalid={formik.errors.username || signUpFailed}
            readOnly={formik.isSubmitting}
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
            isInvalid={formik.errors.username || signUpFailed}
            readOnly={formik.isSubmitting}
          />
          {signUpFailed
            && <Form.Control.Feedback type="invalid">User exists</Form.Control.Feedback>}
        </Form.Group>
        <Button
          type="submit"
          className="w-100"
          variant="outline-primary"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting
            && <Spinner className="mr-2" animation="border" size="sm" />}
          Sign up
        </Button>
      </Form>
    </FormContainer>
  );
};

export default SignUp;

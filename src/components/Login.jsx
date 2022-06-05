/* eslint-disable import/no-unresolved */
import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form, Button, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';

import { useAuth } from '../hooks/index.js';
import routes from '../routes.js';
import FormContainer from './FormContainer';

const Login = () => {
  const [error, setError] = useState(null);

  const auth = useAuth();
  const history = useHistory();
  const usernameRef = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    if (auth.loggedIn) {
      history.replace('/');
    }
    usernameRef.current.focus();
  }, []);

  const handleLogIn = async (values, { setSubmitting }) => {
    setSubmitting(true);
    const url = routes.login();

    setError(null);

    try {
      const res = await axios.post(url, { ...values }, { timeout: 10000, timeoutErrorMessage: 'Network Error' });

      auth.logIn(res.data);

      history.push('/');
    } catch (e) {
      if (e.isAxiosError && e.response && e.response.status === 401) {
        setError('authFailed');
        usernameRef.current.select();
      } else if (e.isAxiosError && e.message === 'Network Error') {
        setError('netError');
        toast.error(t('toast.netError'));
      } else {
        setError('unknown');
        console.error(e);
      }

      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: handleLogIn,
  });

  return (
    <FormContainer>
      <Form className="p-3" onSubmit={formik.handleSubmit}>
        <Form.Group>
          <Form.Label htmlFor="username">{t('labels.yourNickname')}</Form.Label>
          <Form.Control
            name="username"
            id="username"
            autoComplete="username"
            required
            type="text"
            onChange={formik.handleChange}
            value={formik.values.username}
            readOnly={formik.isSubmitting}
            ref={usernameRef}
            isInvalid={!!error}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="password">{t('labels.password')}</Form.Label>
          <Form.Control
            name="password"
            id="password"
            autoComplete="current-password"
            required
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            readOnly={formik.isSubmitting}
            isInvalid={!!error}
          />
          {error
            && <Form.Control.Feedback type="invalid">{t(`errors.${error}`)}</Form.Control.Feedback>}
        </Form.Group>
        <Button
          type="submit"
          variant="outline-primary"
          className="w-100 mb-3"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting
            && <Spinner className="mr-1" animation="border" size="sm" />}
          {t('buttons.logIn')}
        </Button>
        <div className="text-center">
          <span>
            {t('texts.noAccount')}
            &nbsp;
            <Link to="/signup">{t('texts.registration')}</Link>
          </span>
        </div>
      </Form>
    </FormContainer>
  );
};

export default Login;

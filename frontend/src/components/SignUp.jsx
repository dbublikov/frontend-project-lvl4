/* eslint-disable import/no-unresolved */
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';

import { useAuth } from '../hooks/index.js';
import { signUpSchema } from '../validationSchemes.js';
import routes from '../routes.js';
import FormContainer from './FormContainer';

const SignUp = () => {
  const [signUpError, setSignUpError] = useState(null);

  const auth = useAuth();
  const history = useHistory();
  const usernameRef = useRef();
  const { t } = useTranslation();

  const handleSignUp = async ({ username, password }, { setSubmitting }) => {
    setSubmitting(true);

    const url = routes.signup();

    try {
      const res = await axios.post(url, { username, password }, { timeout: 10000, timeoutErrorMessage: 'Network Error' });
      auth.logIn(res.data);

      history.push('/');
    } catch (e) {
      if (e.isAxiosError && e.response && e.response.status === 409) {
        setSignUpError('userExists');
        usernameRef.current.select();
      } else if (e.isAxiosError && e.message === 'Network Error') {
        setSignUpError('netError');
        toast.error(t('toast.netError'));
      } else {
        setSignUpError('unknown');
        console.error(e);
      }

      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: () => {
      setSignUpError(null);

      return signUpSchema;
    },
    onSubmit: handleSignUp,
  });

  useEffect(() => {
    if (auth.loggedIn) {
      history.replace('/');
    }
    usernameRef.current.focus();
  }, [auth.loggedIn, history]);

  return (
    <FormContainer>
      <Form className="p-3" onSubmit={formik.handleSubmit}>
        <Form.Group>
          <Form.Label htmlFor="username">{t('labels.username')}</Form.Label>
          <Form.Control
            name="username"
            id="username"
            autoComplete="username"
            required
            placeholder={t('placeholders.range')}
            onChange={formik.handleChange}
            value={formik.values.username}
            isInvalid={formik.errors.username || signUpError}
            readOnly={formik.isSubmitting}
            ref={usernameRef}
          />
          {formik.errors.username
            && <Form.Control.Feedback type="invalid">{t(formik.errors.username)}</Form.Control.Feedback>}
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="password">{t('labels.password')}</Form.Label>
          <Form.Control
            name="password"
            id="password"
            autoComplete="new-password"
            type="password"
            required
            placeholder={t('placeholders.noShorterThan')}
            onChange={formik.handleChange}
            value={formik.values.password}
            isInvalid={formik.errors.password || signUpError}
            readOnly={formik.isSubmitting}
          />
          {formik.errors.password
            && <Form.Control.Feedback type="invalid">{t(formik.errors.password)}</Form.Control.Feedback>}
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="confirmPassword">{t('labels.confirmPassword')}</Form.Label>
          <Form.Control
            name="confirmPassword"
            id="confirmPassword"
            autoComplete="new-password"
            type="password"
            required
            placeholder={t('placeholders.passwordsMustMatch')}
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            isInvalid={formik.errors.confirmPassword || signUpError}
            readOnly={formik.isSubmitting}
          />
          {formik.errors.confirmPassword
            && <Form.Control.Feedback type="invalid">{t(formik.errors.confirmPassword)}</Form.Control.Feedback>}
          {signUpError
            && <Form.Control.Feedback type="invalid">{t(`errors.${signUpError}`)}</Form.Control.Feedback>}
        </Form.Group>
        <Button
          type="submit"
          className="w-100"
          variant="outline-primary"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting
            && <Spinner className="mr-2" animation="border" size="sm" />}
          {t('buttons.signUp')}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default SignUp;

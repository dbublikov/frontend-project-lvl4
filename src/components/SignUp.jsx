/* eslint-disable import/no-unresolved */
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import { useAuth } from '../hooks/index.js';
import FormContainer from './FormContainer';
import { signUpSchema } from '../validationSchemes.js';
import routes from '../routes.js';

const SignUp = () => {
  const [signUpFailed, setSignUpFailed] = useState(false);

  const auth = useAuth();
  const history = useHistory();
  const usernameRef = useRef();
  const { t } = useTranslation();

  const handleSignUp = async ({ username, password }, { setSubmitting }) => {
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
        usernameRef.current.select();
        return;
      }

      throw e;
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signUpSchema,
    onSubmit: handleSignUp,
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
          <Form.Label htmlFor="username">{t('labels.username')}</Form.Label>
          <Form.Control
            name="username"
            id="username"
            autoComplete="username"
            required
            placeholder={t('placeholders.range')}
            onChange={formik.handleChange}
            value={formik.values.username}
            isInvalid={formik.errors.username || signUpFailed}
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
            isInvalid={formik.errors.password || signUpFailed}
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
            isInvalid={formik.errors.confirmPassword || signUpFailed}
            readOnly={formik.isSubmitting}
          />
          {formik.errors.confirmPassword
            && <Form.Control.Feedback type="invalid">{t(formik.errors.confirmPassword)}</Form.Control.Feedback>}
          {signUpFailed
            && <Form.Control.Feedback type="invalid">{t('errors.userExists')}</Form.Control.Feedback>}
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

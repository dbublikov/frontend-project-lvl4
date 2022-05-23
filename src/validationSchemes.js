import * as yup from 'yup';

export const signUpSchema = yup.object().shape({
  username: yup.string()
    .trim()
    .min(3, 'errors.notInRange')
    .max(20, 'errors.notInRange'),
  password: yup.string()
    .min(6, 'errors.passwordTooShort'),
  confirmPassword: yup.string()
    .oneOf([
      yup.ref('password'),
    ], 'errors.passwordsDontMatch'),
});

export const messageSchema = yup.object().shape({
  body: yup.string().trim().required('errors.emptyField'),
});

export const channelSchema = yup.object().shape({
  name: yup.string()
    .trim()
    .required('errors.emptyField')
    .min(3, 'errors.notInRange')
    .max(20, 'errors.notInRange'),
});

import {
  act, render, screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http.js';
import nock from 'nock';
import '@testing-library/jest-dom/extend-expect.js';
import '@testing-library/jest-dom';

import init from '../src/init.jsx';
import routes from '../src/routes.js';

axios.defaults.adapter = httpAdapter;

const token = 'random-token';
const getDataScope = () => (
  nock('http://localhost', { reqheaders: { Authorization: `Bearer ${token}` } })
    .get(routes.data())
    .reply(200, { channels: [], currentChannelId: null, messages: [] })
);

beforeAll(() => {
  nock.disableNetConnect();
});

beforeEach(async () => {
  const vdom = await init();

  render(vdom);
});

afterAll(() => {
  nock.enableNetConnect();
});

describe('Login', () => {
  test('Login form must be shown', async () => {
    expect(window.location.pathname).toBe('/login');

    expect(await screen.findByRole('button', { name: 'Войти' })).toBeInTheDocument();
  });

  test('Must log in and log out successfully', async () => {
    const scope = nock('http://localhost')
      .post(routes.login(), { username: 'random', password: 'rand' })
      .reply(200, { token, username: 'random' });

    const dataScope = getDataScope();

    await act(async () => {
      userEvent.type(await screen.findByLabelText(/Ваш ник/i), 'random');
      userEvent.type(await screen.findByLabelText(/Пароль/i), 'rand');

      userEvent.click(await screen.findByRole('button', { name: 'Войти' }));
    });

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(dataScope.isDone()).toBe(true);
      expect(window.location.pathname).toBe('/');
    });

    const logOutButton = await screen.findByText(/Выйти/i);

    expect(logOutButton).toBeInTheDocument();

    act(() => {
      userEvent.click(logOutButton);
    });

    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
    });
  });

  test('Error message must be shown', async () => {
    nock('http://localhost')
      .post(routes.login(), { username: 'incorrect', password: 'incorrect' })
      .reply(401, { statusCode: 401 });

    await act(async () => {
      userEvent.type(await screen.findByLabelText(/Ваш ник/i), 'incorrect');
      userEvent.type(await screen.findByLabelText(/Пароль/i), 'incorrect');

      userEvent.click(await screen.findByRole('button', { name: 'Войти' }));
    });

    expect(await screen.findByText(/Неверные имя пользователя или пароль/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Ваш ник/i)).toHaveClass('is-invalid');
    expect(await screen.findByLabelText(/Пароль/i)).toHaveClass('is-invalid');
  });
});

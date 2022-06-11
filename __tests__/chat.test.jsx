import _ from 'lodash';
import {
  act, render, screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http.js';
import nock from 'nock';
import MockedSocket from 'socket.io-mock';
import '@testing-library/jest-dom/extend-expect.js';

import init from '../src/init.jsx';
import routes from '../src/routes.js';
import data from '../__fixtures__/data.js';

axios.defaults.adapter = httpAdapter;

const token = 'random-token';

const getDataScope = () => (
  nock('http://localhost', { reqheaders: { Authorization: `Bearer ${token}` } })
    .get(routes.data())
    .reply(200, data)
);

let socket;

beforeAll(() => {
  nock.disableNetConnect();
});

beforeEach(async () => {
  nock('http://localhost')
    .post(routes.login(), { username: 'user', password: 'pass' })
    .reply(200, { token, username: 'random' });

  socket = new MockedSocket();

  const vdom = await init(socket.socketClient);

  render(vdom);

  await act(async () => {
    userEvent.type(await screen.findByLabelText(/Ваш ник/i), 'user');
    userEvent.type(await screen.findByLabelText(/Пароль/i), 'pass');

    userEvent.click(await screen.findByRole('button', { name: 'Войти' }));
  });
});

afterAll(() => {
  nock.enableNetConnect();
});

describe('Channels', () => {
  test('Must show channels properly', async () => {
    const scope = getDataScope();

    await waitFor(() => expect(scope.isDone()).toBe(true));

    expect(await screen.findByRole('button', { name: 'channel1' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'channel2' })).toBeInTheDocument();
  });

  test('Add channel', async () => {
    getDataScope();

    socket.on('newChannel', (channel, ack) => {
      socket.emit('newChannel', {
        ...channel,
        removable: true,
        id: _.uniqueId(),
      });

      ack({ status: 'ok' });
    });

    expect(await screen.findByRole('button', { name: '+' })).toBeInTheDocument();

    await act(async () => {
      userEvent.click(await screen.findByRole('button', { name: '+' }));
    });

    const modal = await screen.findByRole('dialog');
    expect(modal).toBeInTheDocument();

    await act(async () => {
      userEvent.type(await screen.findByLabelText('Имя канала'), 'new-channel');
      userEvent.click(await screen.findByRole('button', { name: 'Добавить' }));
    });

    await waitFor(() => expect(modal).not.toBeInTheDocument());
    expect(await screen.findByRole('button', { name: 'new-channel' })).toBeInTheDocument();
  });

  test('Rename/Remove channel', async () => {
    getDataScope();

    socket.on('renameChannel', (channel, ack) => {
      socket.emit('renameChannel', { ...channel });

      ack({ status: 'ok' });
    });

    socket.on('removeChannel', (channel, ack) => {
      socket.emit('removeChannel', { ...channel });

      ack({ status: 'ok' });
    });

    // Renaming channel
    await act(async () => {
      userEvent.click(await screen.findByRole('button', { name: /Управление каналом/i }));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('channel-dropdown-menu'))
        .not
        .toHaveStyle('pointer-events: none;');
    });

    await act(async () => {
      userEvent.click(await screen.findByText(/Переименовать/i));
      userEvent.type(await screen.findByLabelText(/Имя канала/i), 'renamed!');
      userEvent.click(await screen.findByRole('button', { name: 'Отправить' }));
    });

    const renamedChannel = await screen.findByRole('button', { name: 'renamed!' });
    expect(renamedChannel).toBeInTheDocument();

    // Removing channel
    await act(async () => {
      userEvent.click(await screen.findByRole('button', { name: /Управление каналом/i }));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('channel-dropdown-menu'))
        .not
        .toHaveStyle('pointer-events: none;');
    });

    await act(async () => {
      userEvent.click(await screen.findByText(/Удалить/i));
      userEvent.click(await screen.findByRole('button', { name: 'Удалить' }));
    });

    expect(renamedChannel).not.toBeInTheDocument();
  });
});

import React, { useEffect, useState } from 'react';
import { Row, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import routes from '../routes.js';
import useAuth from '../hooks/index.js';

import { setInitialState } from '../slices/channelsInfoSlice.js';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';

const getUserId = () => JSON.parse(localStorage.getItem('userId'));

const getAuthorizationHeader = () => {
  const userId = getUserId();

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

function Chat({ socket }) {
  const auth = useAuth();
  const dispatch = useDispatch();

  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const url = routes.data();
      try {
        const res = await axios.get(url, { headers: getAuthorizationHeader() });
        console.log('data: ', res.data);

        dispatch(setInitialState(res.data));

        socket.auth = { token: getUserId().token };
        setContentLoaded(true);
      } catch (e) {
        if (e.isAxiosError && e.response.status === 401) {
          auth.logOut();
          return;
        }
        throw e;
      }
    };
    fetchData();
  }, []);

  return contentLoaded ? (
    <Row className="flex-grow-1 h-75 pb-3">
      <Channels />
      <Messages socket={socket} />
    </Row>
  ) : <Spinner animation="grow" variant="primary" />;
}

export default Chat;

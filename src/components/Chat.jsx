import React, { useEffect, useState } from 'react';
import { Row, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import routes from '../routes.js';
import { useAuth, useSocket } from '../hooks/index.js';

import { setInitialState } from '../slices/channelsInfoSlice.js';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';

const getToken = () => localStorage.getItem('token');

const getAuthorizationHeader = () => {
  const token = getToken();

  if (token) {
    return { Authorization: `Bearer ${token}` };
  }

  return {};
};

const Chat = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const socket = useSocket();

  // const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const url = routes.data();
      try {
        const res = await axios.get(url, { headers: getAuthorizationHeader() });
        console.log('data: ', res.data);

        dispatch(setInitialState(res.data));

        socket.auth = { token: getToken() };
        // setContentLoaded(true);
      } catch (e) {
        // if (e.isAxiosError && e.response.status === 401) {
        //   auth.logOut();
        //   return;
        // }
        // throw e;
        auth.logOut();
      }
    };
    fetchData();
  }, [getToken()]);

  // return contentLoaded ? (
  //   <Row className="flex-grow-1 h-75 pb-3">
  //     <Channels />
  //     <Messages />
  //   </Row>
  // ) : <Spinner animation="grow" variant="primary" />;

  return (
    <Row className="flex-grow-1 h-75 pb-3">
      <Channels />
      <Messages />
    </Row>
  );
};

export default Chat;

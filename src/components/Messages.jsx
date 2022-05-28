import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Col,
  Form,
  InputGroup,
  Button,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { messageSchema } from '../validationSchemes.js';
import { useSocket } from '../hooks/index.js';

const getUsername = () => JSON.parse(localStorage.getItem('userId')).username;

const MessagesBox = () => {
  const { messages } = useSelector((state) => state.messagesInfo);
  const { currentChannelId } = useSelector((state) => state.channelsInfo);

  return (
    <div id="messages-box" className="chat-messages overflow-auto mb-3">
      {messages
        .filter(({ channelId }) => (Number(channelId) === currentChannelId))
        .map(({ id, body, username }) => (
          <div key={id} className="text-break">
            <b>{username}</b>
            :&nbsp;
            {body}
          </div>
        ))}
    </div>
  );
};

const NewMessageForm = () => {
  const { currentChannelId } = useSelector((state) => state.channelsInfo);
  const [state, setState] = useState('filling');

  const socket = useSocket();
  const inputRef = useRef();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema: messageSchema,
    onSubmit: ({ body }) => {
      setState('pending');

      const message = { body, channelId: currentChannelId, username: getUsername() };
      socket.emit('newMessage', message, ({ status }) => {
        if (status === 'ok') {
          setState('filling');

          formik.resetForm();
          inputRef.current.focus();
        }
      });
    },
  });

  return (
    <div className="mt-auto">
      <Form noValidate onSubmit={formik.handleSubmit}>
        <InputGroup hasValidation={formik.errors.body}>
          <Form.Control
            name="body"
            aria-label="body"
            onChange={formik.handleChange}
            value={formik.values.body}
            isInvalid={formik.errors.body}
            readOnly={state === 'pending'}
            ref={inputRef}
          />
          <InputGroup.Append>
            <Button type="submit" disabled={state === 'pending'}>{t('buttons.send')}</Button>
          </InputGroup.Append>
          {formik.errors.body
            && <Form.Control.Feedback type="invalid">{t(formik.errors.body)}</Form.Control.Feedback>}
        </InputGroup>
      </Form>
    </div>
  );
};

const Messages = () => (
  <Col className="h-100">
    <div className="d-flex flex-column h-100">
      <MessagesBox />
      <NewMessageForm />
    </div>
  </Col>
);

export default Messages;

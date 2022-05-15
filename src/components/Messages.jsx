import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Col,
  Form,
  InputGroup,
  Button,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';

const messageSchema = yup.object().shape({
  body: yup.string().required('errors.emptyField'),
});

const getUsername = () => JSON.parse(localStorage.getItem('userId')).username;

function MessagesBox() {
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
}

function NewMessageForm({ socket }) {
  const { currentChannelId } = useSelector((state) => state.channelsInfo);
  const [state, setState] = useState('filling');
  const inputRef = useRef();

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
            <Button type="submit" disabled={state === 'pending'}>Send</Button>
          </InputGroup.Append>
          {formik.errors.body
            && <Form.Control.Feedback type="invalid">Fill the field!</Form.Control.Feedback>}
        </InputGroup>
      </Form>
    </div>
  );
}

function Messages({ socket }) {
  return (
    <Col className="h-100">
      <div className="d-flex flex-column h-100">
        <MessagesBox />
        <NewMessageForm socket={socket} />
      </div>
    </Col>
  );
}

export default Messages;

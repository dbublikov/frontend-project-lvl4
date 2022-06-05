import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Col,
  Form,
  InputGroup,
  Button,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';

import { messageSchema } from '../validationSchemes.js';
import { useSocket } from '../hooks/index.js';

const getUsername = () => localStorage.getItem('username');

const MessagesBox = () => {
  const { messages } = useSelector((state) => state.messagesInfo);
  const { currentChannelId } = useSelector((state) => state.channelsInfo);

  return (
    <div id="messages-box" className="chat-messages overflow-auto mb-3">
      {messages
        .filter(({ channelId }) => (Number(channelId) === currentChannelId))
        .map(({ id, body, username }) => (
          <div key={id} className="text-break">
            <b>{`${username}: `}</b>
            {body}
          </div>
        ))}
    </div>
  );
};

const NewMessageForm = () => {
  const { currentChannelId } = useSelector((state) => state.channelsInfo);

  const socket = useSocket();
  const inputRef = useRef();
  const { t } = useTranslation();

  filter.clearList();
  filter.add(filter.getDictionary('en'));
  filter.add(filter.getDictionary('ru'));

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema: messageSchema,
    onSubmit: ({ body }, { resetForm, setSubmitting }) => {
      setSubmitting(true);

      const filteredMessage = filter.check(body) ? filter.clean(body) : body;

      const message = {
        body: filteredMessage,
        channelId: currentChannelId,
        username: getUsername(),
      };

      if (socket.connected) {
        socket.emit('newMessage', message, ({ status }) => {
          if (status === 'ok') {
            setSubmitting(false);

            resetForm();
            inputRef.current.focus();
          }
        });
      } else {
        setSubmitting(false);

        inputRef.current.focus();
        toast.error(t('toast.netError'));
      }
    },
  });

  return (
    <div className="mt-auto">
      <Form noValidate onSubmit={formik.handleSubmit}>
        <InputGroup hasValidation={formik.errors.body}>
          <Form.Control
            name="body"
            aria-label="Новое сообщение"
            onChange={formik.handleChange}
            value={formik.values.body}
            isInvalid={formik.errors.body}
            readOnly={formik.isSubmitting}
            ref={inputRef}
          />
          <InputGroup.Append>
            <Button type="submit" disabled={formik.isSubmitting}>{t('buttons.send')}</Button>
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

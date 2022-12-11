import React, { useRef, useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Button,
  Spinner,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

import { useSocket } from '../../hooks/index.js';
import { channelSchema } from '../../validationSchemes.js';

const AddChannelForm = ({ onHide }) => {
  const { channels } = useSelector((state) => state.channelsInfo);
  const channelsNames = channels.map(({ name: channelName }) => channelName);

  const socket = useSocket();
  const nameRef = useRef();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: channelSchema(channelsNames),
    onSubmit: ({ name }, { setSubmitting }) => {
      setSubmitting(true);

      const channel = { name };

      if (socket.connected) {
        socket.emit('newChannel', channel, ({ status }) => {
          if (status === 'ok') {
            onHide();
            toast.success(t('toast.add'));
          }
        });
      } else {
        toast.error(t('toast.netError'));
      }
    },
  });

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group>
        <Form.Label htmlFor="name" className="sr-only">Имя канала</Form.Label>
        <Form.Control
          name="name"
          className="mb-2"
          onChange={formik.handleChange}
          value={formik.values.name}
          isInvalid={formik.errors.name}
          readOnly={formik.isSubmitting}
          ref={nameRef}
        />
        {formik.errors.name
          && <Form.Control.Feedback type="invalid">{t(formik.errors.name)}</Form.Control.Feedback>}
      </Form.Group>
      <div className="d-flex justify-content-end border-top pt-2">
        <Button
          type="button"
          className="mr-2"
          variant="secondary"
          onClick={onHide}
          disabled={formik.isSubmitting}
        >
          {t('buttons.cancel')}
        </Button>
        <Button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting
            && <Spinner className="mr-1" animation="border" size="sm" />}
          {t('buttons.add')}
        </Button>
      </div>
    </Form>
  );
};

const AddChannel = ({ onExited }) => {
  const [show, setShow] = useState(true);
  const { t } = useTranslation();

  const onHide = () => {
    setShow(false);
  };

  return (
    <Modal show={show} onHide={onHide} onExited={onExited}>
      <Modal.Header closeButton>
        <Modal.Title>{t('texts.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddChannelForm onHide={onHide} />
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;

import React, { useRef, useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Button,
  Spinner,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';

const channelSchema = yup.object().shape({
  name: yup.string()
    .required('errors.emptyField')
    .min(3, 'errors.notInRange')
    .max(20, 'errors.notInRange'),
});

const AddChannelForm = ({ onHide, socket }) => {
  const nameRef = useRef();

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: channelSchema,
    onSubmit: ({ name }, { setSubmitting }) => {
      setSubmitting(true);

      const channel = { name };

      socket.emit('newChannel', channel, ({ status }) => {
        if (status === 'ok') {
          onHide();
        }
      });
    },
  });

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group>
        <Form.Control
          name="name"
          aria-label="Add channel"
          className="mb-2"
          onChange={formik.handleChange}
          value={formik.values.name}
          isInvalid={formik.errors.name}
          ref={nameRef}
        />
        {formik.errors.name
          && <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>}
      </Form.Group>
      <div className="d-flex justify-content-end border-top pt-2">
        <Button
          type="button"
          className="mr-2"
          variant="secondary"
          onClick={onHide}
          disabled={formik.isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting
            && <Spinner className="mr-1" animation="border" size="sm" />}
          Send
        </Button>
      </div>
    </Form>
  );
};

const AddChannel = ({ onExited, socket }) => {
  const [show, setShow] = useState(true);

  const onHide = () => {
    setShow(false);
  };

  return (
    <Modal show={show} onHide={onHide} onExited={onExited}>
      <Modal.Header closeButton>
        <Modal.Title>Add Channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddChannelForm onHide={onHide} socket={socket} />
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;

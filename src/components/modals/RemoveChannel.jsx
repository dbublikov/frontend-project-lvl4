import React, { useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const RemoveChannel = ({ onExited, socket }) => {
  const [show, setShow] = useState(true);
  const [pending, setPending] = useState(false);
  const { channelId } = useSelector((state) => state.modal.extra);

  const onHide = () => {
    setShow(false);
  };

  const handleRemoveChannel = () => {
    setPending(true);

    socket.emit('removeChannel', { id: channelId }, ({ status }) => {
      if (status === 'ok') {
        onHide();
      }
    });
  };

  return (
    <Modal show={show} onHide={onHide} onExited={onExited}>
      <Modal.Header closeButton>
        <Modal.Title>Remove Channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure?</Modal.Body>
      <Modal.Footer>
        <div>
          <Button
            type="button"
            variant="secondary"
            className="mr-2"
            onClick={onHide}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={pending}
            onClick={handleRemoveChannel}
          >
            {pending
              && <Spinner className="mr-1" animation="border" size="sm" />}
            Remove
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannel;

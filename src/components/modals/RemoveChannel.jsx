import React, { useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const RemoveChannel = ({ onExited, socket }) => {
  const [show, setShow] = useState(true);
  const [pending, setPending] = useState(false);
  const { channelId } = useSelector((state) => state.modal.extra);

  const { t } = useTranslation();

  const onHide = () => {
    setShow(false);
  };

  const handleRemoveChannel = () => {
    setPending(true);

    socket.emit('removeChannel', { id: channelId }, ({ status }) => {
      if (status === 'ok') {
        onHide();
        toast.success(t('toast.remove'));
      }
    });
  };

  return (
    <Modal show={show} onHide={onHide} onExited={onExited}>
      <Modal.Header closeButton>
        <Modal.Title>{t('texts.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t('texts.areYouSure')}</Modal.Body>
      <Modal.Footer>
        <div>
          <Button
            type="button"
            variant="secondary"
            className="mr-2"
            onClick={onHide}
            disabled={pending}
          >
            {t('buttons.cancel')}
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={pending}
            onClick={handleRemoveChannel}
          >
            {pending
              && <Spinner className="mr-1" animation="border" size="sm" />}
            {t('buttons.remove')}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannel;

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Col,
  Nav,
  Button,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap';

import { setCurrentChannelId } from '../slices/channelsInfoSlice.js';
import { openModal } from '../slices/modalSlice.js';

const IrremovableChannel = ({ name, buttonVariant, onClick }) => (
  <Nav.Link
    as={Button}
    variant={buttonVariant}
    block
    className="mb-2 text-left"
    onClick={onClick}
  >
    {name}
  </Nav.Link>
);

const RemovableChannel = ({
  name, buttonVariant, onClick, onRemove, onRename,
}) => (
  <Dropdown as={ButtonGroup} className="d-flex mb-2">
    <Nav.Link
      as={Button}
      variant={buttonVariant}
      onClick={onClick}
      className="text-left flex-grow-1"
    >
      {name}
    </Nav.Link>
    <Dropdown.Toggle
      split
      variant={buttonVariant}
      className="flex-grow-0"
    />
    <Dropdown.Menu>
      <Dropdown.Item onClick={onRemove}>Remove</Dropdown.Item>
      <Dropdown.Item onClick={onRename}>Rename</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

const Channels = () => {
  const { channels, currentChannelId } = useSelector((state) => state.channelsInfo);
  const dispatch = useDispatch();

  const getButtonVariant = (id) => (id === currentChannelId ? 'primary' : 'light');

  const handleClickChannel = (id) => () => {
    dispatch(setCurrentChannelId({ id }));
  };

  const handleAddChannel = () => {
    dispatch(openModal({ type: 'addChannel' }));
  };

  const handleRemoveChannel = (id) => () => {
    const extra = { channelId: id };
    dispatch(openModal({ type: 'removeChannel', extra }));
  };

  const handleRenameChannel = (id, name) => () => {
    const extra = { channelId: id, name };
    dispatch(openModal({ type: 'renameChannel', extra }));
  };

  const renderChannels = () => (
    <Nav variant="pills" fill className="flex-column">
      {channels.map(({ id, name, removable }) => {
        const Channel = removable ? RemovableChannel : IrremovableChannel;
        return (
          <Nav.Item key={id}>
            <Channel
              name={name}
              buttonVariant={getButtonVariant(id)}
              onClick={handleClickChannel(id)}
              onRemove={handleRemoveChannel(id)}
              onRename={handleRenameChannel(id, name)}
            />
          </Nav.Item>
        );
      })}
    </Nav>
  );

  return (
    <Col xs={3} className="border-right">
      <div className="d-flex mb-2">
        <span>Channels</span>
        <Button variant="link" className="ml-auto p-0" onClick={handleAddChannel}>+</Button>
      </div>
      {renderChannels()}
    </Col>
  );
};

export default Channels;

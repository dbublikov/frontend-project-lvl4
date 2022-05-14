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

function IrremovableChannel({ name, buttonVariant, onClick }) {
  return (
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
}

function RemovableChannel({ name, buttonVariant, onClick }) {
  return (
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
        <Dropdown.Item>Remove</Dropdown.Item>
        <Dropdown.Item>Rename</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

function Channels() {
  const { channels, currentChannelId } = useSelector((state) => state.channelsInfo);
  const dispatch = useDispatch();

  const getButtonVariant = (id) => (id === currentChannelId ? 'primary' : 'light');

  const handleClickChannel = (id) => () => {
    dispatch(setCurrentChannelId({ id }));
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
        <Button variant="link" className="ml-auto p-0">+</Button>
      </div>
      {renderChannels()}
    </Col>
  );
}

export default Channels;

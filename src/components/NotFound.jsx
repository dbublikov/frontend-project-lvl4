import React from 'react';
import { Row, Col } from 'react-bootstrap';

function NotFound() {
  return (
    <Row className="align-items-center h-100">
      <Col>
        <div className="text-center">
          <h1>404 Not Found</h1>
          <p>Oops! This page does not exist.</p>
        </div>
      </Col>
    </Row>
  );
}

export default NotFound;

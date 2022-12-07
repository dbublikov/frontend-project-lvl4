import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function FormContainer({ children }) {
  return (
    <Container fluid>
      <Row className="justify-content-center pt-5">
        <Col sm={4}>{children}</Col>
      </Row>
    </Container>
  );
}

export default FormContainer;

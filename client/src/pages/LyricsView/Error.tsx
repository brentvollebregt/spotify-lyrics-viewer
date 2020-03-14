import React from "react";
import { Container } from "react-bootstrap";

const Error: React.FunctionComponent = () => {
  return (
    <Container className="text-center">
      <h2>Error</h2>
      <p>An unexpected error ocurred</p>
    </Container>
  );
};

export default Error;

import React from "react";
import { Container } from "react-bootstrap";

const NoTrackPlaying: React.FunctionComponent = () => {
  return (
    <Container className="text-center">
      <h2>No Song is Playing</h2>
      <p>
        A song must be playing on Spotify for lyrics to be displayed.
        <br />
        Also make sure you are not using a private session.
      </p>
    </Container>
  );
};

export default NoTrackPlaying;

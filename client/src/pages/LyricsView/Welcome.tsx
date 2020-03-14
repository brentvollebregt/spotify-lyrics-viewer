import React from "react";
import { Container } from "react-bootstrap";
import SpotifyLoginStatusButton from "../../components/SpotifyLoginStatusButton";

const Welcome: React.FunctionComponent = () => {
  return (
    <Container className="text-center">
      <h2>Spotify Lyrics Viewer</h2>
      <p>To get access to your current playing song, you need to sign into Spotify.</p>
      <SpotifyLoginStatusButton user={null} />
    </Container>
  );
};

export default Welcome;

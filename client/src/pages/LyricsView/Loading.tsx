import React from "react";
import { Container } from "react-bootstrap";
import PlayerStatus from "./sharedComponents/PlayerStatus";
import LyricsDisplay from "./sharedComponents/LyricsDisplay";

const Loading: React.FunctionComponent = () => {
  return (
    <Container>
      <PlayerStatus
        albumArtUrl={undefined}
        title=""
        artist=""
        album=""
        durationMs={0}
        progressMs={0}
        isPlaying={false}
        spotifyToken={undefined}
      />
      <div className="mt-3">
        <LyricsDisplay
          lyrics={undefined}
          lyricsArtist={undefined}
          lyricsTitle={undefined}
          geniusUrl={undefined}
        />
      </div>
    </Container>
  );
};

export default Loading;

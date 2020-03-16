import React from "react";
import { Container } from "react-bootstrap";
import PlayerStatus from "./sharedComponents/PlayerStatus";
import SpotifyLogoRound from "../../img/spotify-logo-round.png";

const adDuration = 30 * 1000; // Typically 30s

interface IProps {
  current: SpotifyApi.CurrentlyPlayingObject;
  token?: string;
}

const Advertisement: React.FunctionComponent<IProps> = ({ current, token }) => {
  return (
    <Container>
      <PlayerStatus
        albumArtUrl={SpotifyLogoRound}
        title="Advertisement"
        artist="Spotify"
        album=""
        durationMs={adDuration}
        progressMs={current.progress_ms !== null ? current.progress_ms : 0}
        isPlaying={current.is_playing}
        spotifyToken={token}
      />
    </Container>
  );
};

export default Advertisement;

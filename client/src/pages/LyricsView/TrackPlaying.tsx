import React from "react";
import { Container, Spinner } from "react-bootstrap";
import PlayerStatus from "./sharedComponents/PlayerStatus";
import LyricsDisplay from "./sharedComponents/LyricsDisplay";
import { ITrackLyrics } from "./";

interface IProps {
  current: SpotifyApi.CurrentlyPlayingObject;
  lyricDetails?: ITrackLyrics;
  token?: string;
}

const TrackPlaying: React.FunctionComponent<IProps> = ({ current, lyricDetails, token }) => {
  const albumArtUrl = current.item ? current.item.album.images[0].url : undefined;
  const title = current.item ? current.item.name : undefined;
  const artist = current.item ? current.item.artists.map(a => a.name).join(", ") : undefined;
  const album = current.item ? current.item.album.name : undefined;
  const durationMs = current.item !== null ? current.item.duration_ms : 0;
  const progressMs = current.progress_ms !== null ? current.progress_ms : 0;
  const isPlaying = current.is_playing;

  const getLyricsBody = () => {
    // No lyrics yet
    if (lyricDetails === undefined) {
      return (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      );
    }

    // No lyrics found
    if (lyricDetails.lyrics === undefined) {
      return (
        <div className="text-center">
          <div>No lyrics found for the current track.</div>
        </div>
      );
    }

    // Lyrics miss
    if (lyricDetails.lyrics.content === "") {
      return (
        <div className="text-center">
          <div>No lyrics found. Trying again.</div>
          <div className="mt-2">
            <Spinner animation="border" />
          </div>
        </div>
      );
    }

    // Lyrics found
    const { content, artist, title, geniusUrl } = lyricDetails.lyrics;
    return (
      <LyricsDisplay
        lyrics={content}
        lyricsArtist={artist}
        lyricsTitle={title}
        geniusUrl={geniusUrl}
      />
    );
  };

  return (
    <Container>
      <PlayerStatus
        albumArtUrl={albumArtUrl}
        title={title}
        artist={artist}
        album={album}
        durationMs={durationMs}
        progressMs={progressMs}
        isPlaying={isPlaying}
        spotifyToken={token}
      />
      <div className="mt-3">{getLyricsBody()}</div>
    </Container>
  );
};

export default TrackPlaying;

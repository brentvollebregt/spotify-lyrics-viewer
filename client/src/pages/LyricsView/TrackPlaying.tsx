import React from "react";
import { CircularProgress } from "@material-ui/core";

import LyricsDisplay from "./LyricsDisplay";
import { ITrackLyrics } from "../../types/trackLyrics";

interface IProps {
  lyricDetails?: ITrackLyrics;
}

const TrackPlaying: React.FunctionComponent<IProps> = ({ lyricDetails }) => {
  // No lyrics yet
  if (lyricDetails === undefined) {
    return (
      <div className="text-center">
        <CircularProgress size={30} />
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
          <CircularProgress size={30} />
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

export default TrackPlaying;

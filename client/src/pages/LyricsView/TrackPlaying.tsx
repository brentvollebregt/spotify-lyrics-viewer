import React from "react";
import { Box, CircularProgress, Typography } from "@material-ui/core";

import LyricsDisplay from "./LyricsDisplay";
import { ITrackLyrics } from "../../types/trackLyrics";

interface IProps {
  lyricDetails?: ITrackLyrics;
}

const TrackPlaying: React.FunctionComponent<IProps> = ({ lyricDetails }) => {
  // No lyrics yet
  if (lyricDetails === undefined) {
    return (
      <Box textAlign="center">
        <CircularProgress size={30} />
      </Box>
    );
  }

  // No lyrics found
  if (lyricDetails.lyrics === undefined) {
    return (
      <Box textAlign="center">
        <Typography>No lyrics found for the current track.</Typography>
      </Box>
    );
  }

  // Lyrics miss
  if (lyricDetails.lyrics.content === "") {
    return (
      <Box textAlign="center">
        <Typography>No lyrics found. Trying again.</Typography>
        <Box mt={1}>
          <CircularProgress size={30} />
        </Box>
      </Box>
    );
  }

  // Lyrics found
  const { content, artist, title, geniusUrl,syncedLyricsArray } = lyricDetails.lyrics;
  return (
    <LyricsDisplay
      lyrics={content}
      lyricsArtist={artist}
      lyricsTitle={title}
      geniusUrl={geniusUrl}
      syncedLyricsArray={syncedLyricsArray}
    />
  );
};

export default TrackPlaying;

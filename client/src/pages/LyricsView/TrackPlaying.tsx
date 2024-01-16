import React from "react";
import { Box, CircularProgress, Typography } from "@material-ui/core";

import LyricsDisplay from "./LyricsDisplay";
import { ITrackLyrics } from "../../types/trackLyrics";
import { PlayingStatePaused, PlayingStatePlaying } from "../../types/currentlyPlayingState";

interface IProps {
  lyricDetails?: ITrackLyrics;
  currentlyPlayingSong?: PlayingStatePlaying | PlayingStatePaused;
}

const TrackPlaying: React.FunctionComponent<IProps> = ({ lyricDetails, currentlyPlayingSong }) => {
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
  const { content, syncedLyricsArray } = lyricDetails.lyrics;
  return (
    <LyricsDisplay
      lyrics={content}
      syncedLyricsArray={syncedLyricsArray}
      progressMs={currentlyPlayingSong?.currentlyPlayingObject?.progress_ms ?? 0}
      lyricsArtist={lyricDetails.lyrics?.artist}
      lyricsTitle={lyricDetails.lyrics?.title}
      lyricsSourceReference={lyricDetails.lyrics?.lyricsSourceReference}
      paused={!currentlyPlayingSong?.currentlyPlayingObject?.is_playing ?? false}
    />
  );
};

export default TrackPlaying;

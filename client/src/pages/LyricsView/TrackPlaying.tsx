import { Box, CircularProgress, Typography } from "@material-ui/core";
import React from "react";
import { PlayingStatePaused, PlayingStatePlaying } from "../../types/currentlyPlayingState";
import { ITrackLyrics } from "../../types/trackLyrics";
import LyricsDisplay from "./LyricsDisplay";

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
  const lyricsAreEmpty =
    lyricDetails?.lyrics?.plainLyrics === undefined &&
    (lyricDetails?.lyrics?.syncedLyrics ?? undefined) === undefined;
  if (lyricsAreEmpty) {
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
  return (
    <LyricsDisplay
      lyricsDetails={lyricDetails.lyrics}
      progressMs={currentlyPlayingSong?.currentlyPlayingObject?.progress_ms ?? 0}
      paused={!currentlyPlayingSong?.currentlyPlayingObject?.is_playing ?? false}
    />
  );
};

export default TrackPlaying;

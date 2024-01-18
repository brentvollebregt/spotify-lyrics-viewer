import { Box, Typography } from "@material-ui/core";
import React from "react";

const NoTrackPlaying: React.FunctionComponent = () => {
  return (
    <Box textAlign="center">
      <Typography variant="h4" gutterBottom>
        No Song is Playing
      </Typography>

      <Typography>
        A song must be playing on Spotify for lyrics to be displayed.
        <br />
        Also make sure you are not using a private session.
      </Typography>
    </Box>
  );
};

export default NoTrackPlaying;

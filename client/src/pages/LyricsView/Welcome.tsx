import React from "react";
import { Box, Typography } from "@material-ui/core";

import SpotifyLoginStatusButton from "../../components/SpotifyLoginStatusButton";

const Welcome: React.FunctionComponent = () => {
  return (
    <Box textAlign="center">
      <Typography variant="h4" gutterBottom>
        Spotify Lyrics Viewer
      </Typography>

      <Typography gutterBottom>
        To get access to your current playing song, you need to sign into Spotify.
      </Typography>

      <SpotifyLoginStatusButton user={null} />
    </Box>
  );
};

export default Welcome;

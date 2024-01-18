import { Box, CircularProgress, Typography } from "@material-ui/core";
import React from "react";

const Loading: React.FunctionComponent = () => {
  return (
    <Box textAlign="center">
      <Typography variant="h4" gutterBottom>
        Loading...
      </Typography>

      <Typography gutterBottom>
        To get access to your current playing song, you need to sign into Spotify.
      </Typography>

      <CircularProgress size={30} />
    </Box>
  );
};

export default Loading;

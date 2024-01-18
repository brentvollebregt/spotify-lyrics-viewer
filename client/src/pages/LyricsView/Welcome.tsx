import { Avatar, Box, Button, Typography } from "@material-ui/core";
import { navigate } from "hookrouter";
import React from "react";
import SpotifyLogoRoundImage from "../../img/spotify-logo-round.png";

const Welcome: React.FunctionComponent = () => {
  const onLoginButtonClicked = () => {
    navigate("/spotify-authorization");
  };

  return (
    <Box textAlign="center">
      <Typography variant="h4" gutterBottom>
        Spotify Lyrics Viewer
      </Typography>

      <Typography gutterBottom>
        To get access to your current playing song, you need to sign into Spotify.
      </Typography>

      <Button
        variant="outlined"
        color="primary"
        onClick={onLoginButtonClicked}
        startIcon={
          <Avatar
            src={SpotifyLogoRoundImage}
            alt="Spotify Logo Round"
            style={{ width: 20, height: 20 }}
          />
        }
      >
        Sign In With Spotify
      </Button>
    </Box>
  );
};

export default Welcome;

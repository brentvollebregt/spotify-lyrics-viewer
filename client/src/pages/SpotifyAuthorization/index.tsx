import { Box, CircularProgress, Typography } from "@material-ui/core";
import { navigate } from "hookrouter";
import React from "react";
import Config from "../../config";

interface IProps {
  onNewToken: (accessToken: string, expiresIn: number) => void;
}

const SpotifyAuthorization: React.FC<IProps> = ({ onNewToken }) => {
  const { search } = window.location;

  let message = <></>;

  if (search === "") {
    // No token in URL, redirect user to request for one
    window.location.href = Config.api.root + Config.api.spotify_authentication_route;
    message = (
      <>
        <Box mb={2}>
          <Typography variant="subtitle1">Redirecting</Typography>
        </Box>
        <CircularProgress size={30} />
      </>
    );
  } else {
    // We have received the token, read it from the URL
    const params = new URLSearchParams(search.substr(1));
    const accessToken = params.get("access_token");
    const expiresAt = params.get("expires_at");

    if (accessToken !== null && expiresAt !== null) {
      // All parameters are present
      onNewToken(accessToken, parseInt(expiresAt, 10));
      navigate("/");
      message = <Typography variant="subtitle1">Token received</Typography>;
    } else {
      message = <Typography variant="subtitle1">Incorrect URL parameters</Typography>;
    }
  }

  return (
    <>
      <Typography variant="h4" align="center">
        Spotify Authorization
      </Typography>
      <Box alignItems="center" textAlign="center">
        {message}
      </Box>
    </>
  );
};

export default SpotifyAuthorization;

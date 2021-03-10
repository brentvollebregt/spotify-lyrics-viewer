import React from "react";
import { navigate } from "hookrouter";
import { Avatar, Button } from "@material-ui/core";

import SpotifyLogoRoundImage from "../img/spotify-logo-round.png";

interface IProps {
  user: SpotifyApi.CurrentUsersProfileResponse | null;
  onLoggedInClick?: () => void;
}

const SpotifyLoginStatusButton: React.FunctionComponent<IProps> = ({ user, onLoggedInClick }) => {
  const loggedInStatusButtonClick = () => {
    if (user === null) {
      navigate("/spotify-authorization");
    } else {
      if (onLoggedInClick) {
        onLoggedInClick();
      }
    }
  };

  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={loggedInStatusButtonClick}
      startIcon={
        <Avatar
          src={
            user !== null && user.images !== undefined && user.images.length > 0
              ? user.images[0].url
              : SpotifyLogoRoundImage
          }
          alt={
            user !== null && user.images !== undefined && user.images.length > 0
              ? user.display_name + " Logo"
              : "Spotify Logo Round"
          }
          style={{ width: 20, height: 20 }}
        />
      }
    >
      {user !== null ? user.display_name : "Sign In With Spotify"}
    </Button>
  );
};

export default SpotifyLoginStatusButton;

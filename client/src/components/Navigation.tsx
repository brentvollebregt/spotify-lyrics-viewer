import React from "react";
import { AppBar, Toolbar, Typography, Container, Box } from "@material-ui/core";
import { navigate, usePath } from "hookrouter";

import SpotifyLoginStatusButton from "./SpotifyLoginStatusButton";
import BannerImage from "../img/banner.png";

const navbarLinks: { [key: string]: string } = {
  "/": "Home",
  "/about": "About"
};

interface IProps {
  user: SpotifyApi.UserObjectPrivate | null;
  onLogout: () => void;
}

const Navigation: React.FunctionComponent<IProps> = ({ user, onLogout }) => {
  const currentPath = usePath(); // TODO Active

  const goTo = (location: string) => () => navigate(location);
  const logoutCheck = () => {
    const answer = window.confirm("Are you sure you want to logout?");
    if (answer) {
      onLogout();
    }
  };

  return (
    <AppBar position="static" style={{ background: "#f8f9fa" }}>
      <Container maxWidth="md">
        <Toolbar>
          <img
            src={BannerImage}
            height="30"
            className="d-inline-block align-top"
            alt="Spotify Lyrics Viewer Banner Logo"
            style={{ cursor: "pointer" }}
          />

          {Object.keys(navbarLinks).map(path => (
            <Box display="inline" ml={2}>
              <a href="#" onClick={goTo(path)}>
                <Typography variant="body1">{navbarLinks[path]}</Typography>
              </a>
            </Box>
          ))}

          <div style={{ flexGrow: 1 }} />

          <SpotifyLoginStatusButton user={user} onLoggedInClick={logoutCheck} />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;

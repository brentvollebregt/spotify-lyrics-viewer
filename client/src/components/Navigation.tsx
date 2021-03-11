import React from "react";
import { AppBar, Toolbar, Typography, Container, Box, makeStyles } from "@material-ui/core";
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
  const classes = useStyles();
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
            alt="Spotify Lyrics Viewer Banner Logo"
            style={{ cursor: "pointer" }}
            onClick={goTo("/")}
          />

          {Object.keys(navbarLinks).map(path => (
            <Box display="inline" ml={2}>
              <a
                href="#"
                onClick={goTo(path)}
                className={`${classes.link} ${currentPath === path ? classes.activeLink : ""}`}
              >
                <Typography variant="body1">{navbarLinks[path]}</Typography>
              </a>
            </Box>
          ))}

          <div style={{ flexGrow: 1 }} />

          {/* TODO GitHub */}

          <SpotifyLoginStatusButton user={user} onLoggedInClick={logoutCheck} />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const useStyles = makeStyles(theme => ({
  link: {
    textDecoration: "none",
    color: theme.palette.text.secondary,
    "&:hover": {
      color: theme.palette.text.primary
    }
  },
  activeLink: {
    color: theme.palette.text.primary
  }
}));

export default Navigation;

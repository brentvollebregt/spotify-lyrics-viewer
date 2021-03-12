import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  makeStyles,
  IconButton,
  Avatar
} from "@material-ui/core";
import { navigate, usePath } from "hookrouter";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import DarkModeIcon from "@material-ui/icons/Brightness4";
import LightModeIcon from "@material-ui/icons/Brightness7";
import GitHubIcon from "@material-ui/icons/GitHub";

import BannerImage from "../img/banner.png";

const navbarLinks: { [key: string]: string } = {
  "/": "Home",
  "/about": "About"
};

interface IProps {
  user: SpotifyApi.UserObjectPrivate | null;
  onLogout: () => void;
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

const Navigation: React.FunctionComponent<IProps> = ({
  user,
  onLogout,
  onThemeToggle,
  isDarkMode
}) => {
  const classes = useStyles();
  const currentPath = usePath();

  const goTo = (location: string) => () => navigate(location);

  const onGitHubIconClicked = () => {
    window.location.href = "https://github.com/brentvollebregt/spotify-lyrics-viewer";
  };

  const onUserIconClick = () => {
    if (user === null) {
      navigate("/spotify-authorization");
    } else {
      const answer = window.confirm("Are you sure you want to logout?");
      if (answer) {
        onLogout();
      }
    }
  };

  return (
    <AppBar position="static" className={classes.appBar}>
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

          <IconButton onClick={onGitHubIconClicked}>
            <GitHubIcon />
          </IconButton>

          <IconButton onClick={onThemeToggle}>
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <IconButton onClick={onUserIconClick}>
            {user !== null ? (
              <Avatar
                alt={user.display_name + " Logo"}
                src={user.images !== undefined ? user.images[0].url : undefined}
                className={classes.userIcon}
              >
                {user.display_name?.substring(0, 1)}
              </Avatar>
            ) : (
              <AccountCircleIcon />
            )}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: theme.palette.background.paper
  },
  link: {
    textDecoration: "none",
    color: theme.palette.text.secondary,
    "&:hover": {
      color: theme.palette.text.primary
    }
  },
  activeLink: {
    color: theme.palette.text.primary
  },
  userIcon: {
    width: 30,
    height: 30
  }
}));

export default Navigation;

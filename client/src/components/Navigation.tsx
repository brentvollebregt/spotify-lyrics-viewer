import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Link,
  Toolbar,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import DarkModeIcon from "@material-ui/icons/Brightness4";
import LightModeIcon from "@material-ui/icons/Brightness7";
import GitHubIcon from "@material-ui/icons/GitHub";
import { navigate, usePath } from "hookrouter";
import React from "react";
import BannerImageDark from "../img/banner-dark.png";
import BannerImage from "../img/banner.png";
import LogoImage from "../img/logo.png";

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
  const theme = useTheme();

  const showFullLogo = useMediaQuery(theme.breakpoints.up("sm"));

  const goTo = (location: string) => (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    navigate(location);
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
        <Toolbar className={classes.toolbar}>
          <Link href="/" onClick={goTo("/")}>
            {showFullLogo ? (
              <img
                src={isDarkMode ? BannerImageDark : BannerImage}
                height="30"
                alt="Spotify Lyrics Viewer Banner"
                className={classes.logo}
              />
            ) : (
              <img
                src={LogoImage}
                height="30"
                alt="Spotify Lyrics Viewer Logo"
                className={classes.logo}
              />
            )}
          </Link>

          {Object.keys(navbarLinks).map(path => (
            <Box key={path} display="inline" ml={2}>
              <Link
                href={path}
                onClick={goTo(path)}
                className={`${classes.link} ${currentPath === path ? classes.activeLink : ""}`}
              >
                <Typography variant="body1">{navbarLinks[path]}</Typography>
              </Link>
            </Box>
          ))}

          <div className={classes.grow} />

          <Link href="https://github.com/brentvollebregt/spotify-lyrics-viewer">
            <IconButton>
              <GitHubIcon />
            </IconButton>
          </Link>

          <IconButton onClick={onThemeToggle}>
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <IconButton onClick={onUserIconClick}>
            {user !== null ? (
              <Avatar
                alt={user.display_name + " Logo"}
                src={
                  user.images !== undefined && user.images.length > 0
                    ? user.images[0].url
                    : undefined
                }
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
  toolbar: {
    padding: 0
  },
  logo: {
    cursor: "pointer"
  },
  link: {
    textDecoration: "none",
    color: theme.palette.text.secondary,
    "&:hover": {
      color: theme.palette.text.primary,
      textDecoration: "none"
    }
  },
  activeLink: {
    color: theme.palette.text.primary
  },
  userIcon: {
    width: 30,
    height: 30
  },
  // Utils
  grow: {
    flexGrow: 1
  }
}));

export default Navigation;

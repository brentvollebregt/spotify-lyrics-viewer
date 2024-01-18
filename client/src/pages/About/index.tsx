import { Box, Link, Typography } from "@material-ui/core";
import React from "react";

const About: React.FC = () => {
  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <Typography variant="h4" align="center" gutterBottom>
        About
      </Typography>

      <Typography gutterBottom>
        Spotify Lyrics Viewer is a tool that allows you to view the lyrics of the current playing
        song on Spotify.
      </Typography>
      <Typography gutterBottom>
        To do this, we first log you into Spotify so we can see the current song playing. The title
        and artist are then used to try and find the lyrics on{" "}
        <Link href="https://genius.com/">GENIUS</Link> and whatever lyrics matched the best are
        displayed to you.
      </Typography>
      <Typography gutterBottom>
        Please note that the lyrics returned may not be for the current playing song in some
        situations due the the lyrics not existing on GENIUS or the fact that the current playing
        songs title has some extra content to it aside from the actual title.
      </Typography>

      <Box mt={3}>
        <Typography align="center">
          <Link href="https://github.com/brentvollebregt/spotify-lyrics-viewer">Source</Link>
          {" • "}
          <Link href="https://github.com/brentvollebregt">Brent Vollebregt</Link>
          {" • "}
          <Link href="https://nitratine.net/">Nitratine.net</Link>
        </Typography>
      </Box>
    </div>
  );
};

export default About;

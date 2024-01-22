import { AppBar, Box, Container, Slider, makeStyles } from "@material-ui/core";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import React from "react";
import SpotifyWebApi from "spotify-web-api-js";
import useSmoothProgress from "../hooks/useSmoothProgress";
import SpotifyLogoRoundImage from "../img/spotify-logo-round.png";
import { CurrentlyPlayingState } from "../types/currentlyPlayingState";
import { IToken } from "../types/token";
import { formatMilliseconds, responseError } from "../utils";

const placeholder1PxImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8+x8AAr8B3gzOjaQAAAAASUVORK5CYII="; // Generated using https://png-pixel.com/

interface PlayerProps {
  currentlyPlayingSong: CurrentlyPlayingState;
  token: IToken | null;
}

const Player: React.FC<PlayerProps> = ({ currentlyPlayingSong, token }) => {
  const classes = useStyles();

  let albumArt = currentlyPlayingSong.currentlyPlayingObject?.item?.album.images[0].url;
  let title = currentlyPlayingSong.currentlyPlayingObject?.item?.name ?? "---";
  let artist =
    currentlyPlayingSong.currentlyPlayingObject?.item?.artists.map(a => a.name).join(", ") ?? "---";
  let durationMs = currentlyPlayingSong.currentlyPlayingObject?.item?.duration_ms ?? 0;
  const progressMs = currentlyPlayingSong.currentlyPlayingObject?.progress_ms ?? 0;
  const isPlaying = currentlyPlayingSong.currentlyPlayingObject?.is_playing ?? false;

  if (currentlyPlayingSong?.currentlyPlayingObject?.currently_playing_type === "ad") {
    albumArt = SpotifyLogoRoundImage;
    title = "Advertisement";
    artist = "Spotify";
    durationMs = Math.max(progressMs, 30 * 1000); // Typically 30s but allow for something over
  }

  const {
    onUserFinishedSliding,
    onUserSlide,
    progress: smoothedProgressMs
  } = useSmoothProgress(progressMs, durationMs, isPlaying, token);

  const onSkipPrevious = () => {
    if (token) {
      const spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(token.value);
      spotifyApi.skipToPrevious().catch(e => responseError("Failed to Skip to Previous Song", e));
    }
  };
  const onSkipNext = () => {
    if (token) {
      const spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(token.value);
      spotifyApi.skipToNext().catch(e => {
        responseError("Failed to Skip to Next Song", e);
      });
    }
  };
  const onPlayPauseToggle = () => {
    if (token) {
      const spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(token.value);
      if (isPlaying) {
        spotifyApi.pause().catch(e => responseError("Failed to Pause", e));
      } else {
        spotifyApi.play().catch(e => responseError("Failed to Play", e));
      }
    }
  };

  return (
    <AppBar position="static" color="primary" className={classes.appBar}>
      <Container maxWidth="md">
        <div className={classes.playerWrapper}>
          <div className={classes.songWrapper}>
            <div className={classes.songAlbumArtWrapper}>
              <img
                src={albumArt ?? placeholder1PxImage}
                className={classes.songAlbumArt}
                alt={`Album art for current song`}
              />
            </div>
            <div className={classes.songDetail} title={title}>
              {title}
            </div>
            <div className={classes.songDetail} title={artist}>
              {artist}
            </div>
          </div>

          <div className={classes.controlsWrapper}>
            <SkipPreviousIcon
              fontSize="large"
              className={classes.control}
              onClick={onSkipPrevious}
            />

            {isPlaying ? (
              <PauseCircleFilledIcon
                fontSize="large"
                htmlColor="black"
                onClick={onPlayPauseToggle}
                className={classes.control}
              />
            ) : (
              <PlayCircleFilledIcon
                fontSize="large"
                htmlColor="black"
                onClick={onPlayPauseToggle}
                className={classes.control}
              />
            )}

            <SkipNextIcon fontSize="large" className={classes.control} onClick={onSkipNext} />
          </div>

          <Box display="inline-flex" alignItems="center" className={classes.sliderWrapper}>
            <span className={classes.timeControl}>{formatMilliseconds(smoothedProgressMs)}</span>

            <Slider
              valueLabelDisplay="off"
              value={smoothedProgressMs}
              min={0}
              max={durationMs}
              onChangeCommitted={onUserFinishedSliding}
              onChange={onUserSlide}
              className={classes.slider}
            />
            <span className={classes.timeControl}>{formatMilliseconds(durationMs)}</span>
          </Box>
        </div>
      </Container>
    </AppBar>
  );
};

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: theme.palette.background.paper,
    top: "auto",
    bottom: 0,
    background: "#f8f9fa",
    paddingTop: 6,
    paddingBottom: 6
  },
  playerWrapper: {
    display: "grid",
    gridTemplateColumns: "auto auto 1fr",
    gridColumnGap: 16,
    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: "auto auto"
    }
  },
  songWrapper: {
    display: "inline-grid",
    gridTemplateColumns: "auto 1fr",
    gridTemplateRows: "1fr 1fr",
    gridColumnGap: 5,
    maxWidth: 250
  },
  songAlbumArtWrapper: {
    gridColumnStart: 1,
    gridColumnEnd: 2,
    gridRowStart: 1,
    gridRowEnd: 3
  },
  songAlbumArt: {
    height: 40,
    width: 40
  },
  songDetail: {
    color: theme.palette.text.primary,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  timeControl: {
    color: theme.palette.text.primary,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  controlsWrapper: {
    display: "inline-grid",
    gridTemplateColumns: "auto auto auto",
    alignItems: "center",
    justifyContent: "center"
  },
  control: {
    color: theme.palette.text.primary,
    cursor: "pointer"
  },
  sliderWrapper: {
    [theme.breakpoints.down("xs")]: {
      gridColumnStart: 1,
      gridColumnEnd: 3
    }
  },
  slider: {
    [theme.breakpoints.down("xs")]: {
      padding: "10px 0"
    },
    marginLeft: 10,
    marginRight: 10
  }
}));

export default Player;

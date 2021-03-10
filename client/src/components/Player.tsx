import React from "react";
import { AppBar, Box, Slider, Container } from "@material-ui/core";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import SpotifyWebApi from "spotify-web-api-js";

import { IToken } from "../types/token";
import { CurrentlyPlayingState } from "../types/currentlyPlayingState";
import { responseError } from "../utils";
import useSmoothProgress from "../hooks/useSmoothProgress";
import SpotifyLogoRoundImage from "../img/spotify-logo-round.png";
import GithubLogo from "../img/github-logo.png"; // TODO Move to about

const placeholder1PxImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8+x8AAr8B3gzOjaQAAAAASUVORK5CYII="; // Generated using https://png-pixel.com/

interface PlayerProps {
  currentlyPlayingSong: CurrentlyPlayingState;
  token: IToken | null;
}

// TODO Add mobile support

const Player: React.FC<PlayerProps> = ({ currentlyPlayingSong, token }) => {
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
    onUserStartSliding,
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
    <AppBar
      position="static"
      color="primary"
      style={{ top: "auto", bottom: 0, background: "#f8f9fa", paddingTop: 6, paddingBottom: 6 }}
    >
      <Container maxWidth="md">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto 1fr",
            gridGap: 16
          }}
        >
          <div
            style={{
              display: "inline-grid",
              gridTemplateColumns: "auto 1fr",
              gridTemplateRows: "1fr 1fr",
              gridColumnGap: 5,
              maxWidth: 250 // TODO Need to play with this
            }}
          >
            <div
              style={{
                gridColumnStart: 1,
                gridColumnEnd: 2,
                gridRowStart: 1,
                gridRowEnd: 3
              }}
            >
              <img src={albumArt ?? placeholder1PxImage} style={{ height: 40, width: 40 }} />
            </div>
            <div
              style={{
                color: "black",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
              title={title}
            >
              {title}
            </div>
            <div
              style={{
                color: "black",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
              title={artist}
            >
              {artist}
            </div>
          </div>

          <div
            style={{
              display: "inline-grid",
              gridTemplateColumns: "auto auto auto",
              alignItems: "center"
            }}
          >
            <SkipPreviousIcon fontSize="large" htmlColor="black" onClick={onSkipPrevious} />
            {isPlaying ? (
              <PauseCircleFilledIcon
                fontSize="large"
                htmlColor="black"
                onClick={onPlayPauseToggle}
              />
            ) : (
              <PlayCircleFilledIcon
                fontSize="large"
                htmlColor="black"
                onClick={onPlayPauseToggle}
              />
            )}

            <SkipNextIcon fontSize="large" htmlColor="black" onClick={onSkipNext} />
          </div>

          <Box style={{ display: "inline-flex", alignItems: "center" }}>
            <Slider
              valueLabelDisplay="off"
              value={smoothedProgressMs}
              min={0}
              max={durationMs}
              onMouseDown={onUserStartSliding}
              onMouseUp={onUserFinishedSliding}
              onChange={onUserSlide}
            />
          </Box>
        </div>
      </Container>
    </AppBar>
  );
};

export default Player;

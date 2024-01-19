import cogoToast from "cogo-toast";
import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import config from "../config";
import { CurrentlyPlayingState, PlayingStates } from "../types/currentlyPlayingState";
import { IToken } from "../types/token";

const useCurrentlyPlayingSong = (token: IToken | null, invalidateToken: () => void) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlayingState>({
    state: PlayingStates.Loading,
    currentlyPlayingObject: null
  });
  const [checkSongTimeout, setCheckSongTimeout] = useState<NodeJS.Timeout | null>(null);

  const updateCurrentPlaying = (tokenValue: string) => {
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(tokenValue);
    spotifyApi
      .getMyCurrentPlayingTrack()
      .then((currentlyPlayingObject: SpotifyApi.CurrentlyPlayingObject | "") => {
        if (currentlyPlayingObject === "") {
          setCurrentlyPlaying({ state: PlayingStates.NotPlaying, currentlyPlayingObject: null }); // HTTP 204 when no track is currently playing
        } else {
          const state: PlayingStates = currentlyPlayingObject.is_playing
            ? PlayingStates.Playing
            : PlayingStates.Paused;
          setCurrentlyPlaying({
            state,
            currentlyPlayingObject: currentlyPlayingObject
          });
        }
      })
      .catch((request: XMLHttpRequest) => {
        if (request.status === 401) {
          invalidateToken();
          const { hide } = cogoToast.info("You have been logged out", {
            position: "bottom-center",
            heading: "Token expired",
            hideAfter: 20,
            onClick: () => hide !== undefined && hide()
          });
        } else {
          setCurrentlyPlaying({ state: PlayingStates.Error, currentlyPlayingObject: null });
          const { hide } = cogoToast.error(request.responseText, {
            position: "bottom-center",
            heading: "Failed to Get Current Song",
            hideAfter: 20,
            onClick: () => hide !== undefined && hide()
          });
        }
      });
  };

  // Get currently playing song on load (when the token changes)
  useEffect(() => {
    if (token !== null) {
      updateCurrentPlaying(token.value);
    } else {
      setCurrentlyPlaying({ state: PlayingStates.Loading, currentlyPlayingObject: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Setup a check for a new song at the end of the current song
  useEffect(() => {
    if (checkSongTimeout !== null) {
      clearTimeout(checkSongTimeout);
    }

    if (
      (currentlyPlaying.state === PlayingStates.Playing ||
        currentlyPlaying.state === PlayingStates.Paused) &&
      currentlyPlaying.currentlyPlayingObject.item !== null
    ) {
      const timeToRefresh =
        currentlyPlaying.currentlyPlayingObject.item.duration_ms -
        (currentlyPlaying.currentlyPlayingObject.progress_ms === null
          ? 0
          : currentlyPlaying.currentlyPlayingObject.progress_ms) +
        500; // (duration - progress) - 500ms
      setCheckSongTimeout(
        setTimeout(() => {
          if (token !== null) {
            updateCurrentPlaying(token.value);
          }
        }, timeToRefresh)
      );
    }

    return () => {
      if (checkSongTimeout !== null) {
        clearTimeout(checkSongTimeout);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlyPlaying]);

  // Setup timers to periodically check for a new song (in case someone skips)
  useEffect(() => {
    const intervalCheck = setInterval(() => {
      if (token !== null) {
        updateCurrentPlaying(token.value);
      }
    }, config.client.trackCheckDelaySeconds * 1000);

    return () => clearTimeout(intervalCheck);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return currentlyPlaying;
};

export default useCurrentlyPlayingSong;

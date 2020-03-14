import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import cogoToast from "cogo-toast";
import Advertisement from "./Advertisement";
import Error from "./Error";
import Loading from "./Loading";
import NoTrackPlaying from "./NoTrackPlaying";
import TrackPlaying from "./TrackPlaying";
import Welcome from "./Welcome";
import { geniusGetLyrics } from "../../api";
import { IToken } from "../../models";

const periodicTrackCheckDelayMs = 5000;

export interface ILyricDetails {
  content: string;
  spotifyId: string;
  artist: string;
  title: string;
  geniusUrl: string;
}

interface IProps {
  token: IToken | null;
  invalidateToken: () => void;
}

const LyricsView: React.FunctionComponent<IProps> = (props: IProps) => {
  const { token, invalidateToken } = props;

  const [currentlyPlaying, setCurrentlyPlaying] = useState<
    SpotifyApi.CurrentlyPlayingObject | "NotPlaying" | "Loading" | "Error"
  >("Loading");
  const [lyrics, setLyrics] = useState<ILyricDetails | undefined>(undefined);
  const [checkSongTimeout, setCheckSongTimeout] = useState<NodeJS.Timeout | null>(null);

  const updateCurrentPlaying = (tokenValue: string) => {
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(tokenValue);
    spotifyApi
      .getMyCurrentPlayingTrack()
      .then((currentlyPlayingObject: SpotifyApi.CurrentlyPlayingObject | "") => {
        if (currentlyPlayingObject === "") {
          setCurrentlyPlaying("NotPlaying"); // HTTP 204 when no track is currently playing
        } else {
          setCurrentlyPlaying(currentlyPlayingObject);
        }
      })
      .catch((request: XMLHttpRequest) => {
        if (request.status === 401) {
          invalidateToken();
          const { hide } = cogoToast.info("You have been logged out", {
            position: "bottom-center",
            heading: "Token expired",
            hideAfter: 20,
            onClick: () => hide()
          });
        } else {
          setCurrentlyPlaying("Error");
          const { hide } = cogoToast.error(request.responseText, {
            position: "bottom-center",
            heading: "Failed to Get Current Song",
            hideAfter: 20,
            onClick: () => hide()
          });
        }
      });
  };

  useEffect(() => {
    // Get currently playing song on load (when the token changes)
    if (token !== null) {
      updateCurrentPlaying(token.value);
    } else {
      setCurrentlyPlaying("Loading");
    }
  }, [token]);

  useEffect(() => {
    // Setup a check for a new song at the end of the current song
    if (checkSongTimeout !== null) {
      clearTimeout(checkSongTimeout);
    }

    if (
      currentlyPlaying !== "NotPlaying" &&
      currentlyPlaying !== "Loading" &&
      currentlyPlaying !== "Error" &&
      currentlyPlaying.item
    ) {
      const timeToRefresh =
        currentlyPlaying.item.duration_ms -
        (currentlyPlaying.progress_ms === null ? 0 : currentlyPlaying.progress_ms) +
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
  }, [currentlyPlaying]);

  useEffect(() => {
    // Setup timers to periodically check for a new song (in case someone skips)
    const intervalCheck = setInterval(() => {
      if (token !== null) {
        updateCurrentPlaying(token.value);
      }
    }, periodicTrackCheckDelayMs);

    return () => clearTimeout(intervalCheck);
  }, [token]);

  useEffect(() => {
    // Get new lyrics when the current playing item changes
    if (
      currentlyPlaying === "NotPlaying" ||
      currentlyPlaying === "Loading" ||
      currentlyPlaying === "Error" ||
      !currentlyPlaying.item
    ) {
      setLyrics(undefined);
    } else {
      if (lyrics === undefined || currentlyPlaying.item.id !== lyrics.spotifyId) {
        setLyrics(undefined);
        // Get lyrics
        geniusGetLyrics(currentlyPlaying.item.artists[0].name, currentlyPlaying.item.name).then(
          newLyrics => {
            if (currentlyPlaying.item !== null) {
              setLyrics({
                artist: newLyrics.artist,
                content: newLyrics.lyrics,
                geniusUrl: newLyrics.geniusUrl,
                spotifyId: currentlyPlaying.item.id,
                title: newLyrics.title
              });
            }
          }
        );
      }
    }
  }, [currentlyPlaying]);

  if (token === null) {
    return <Welcome />;
  } else if (currentlyPlaying === "Loading") {
    return <Loading />;
  } else if (currentlyPlaying === "NotPlaying") {
    return <NoTrackPlaying />;
  } else if (currentlyPlaying === "Error") {
    return <Error />;
  } else if (currentlyPlaying.currently_playing_type === "ad") {
    return (
      <Advertisement current={currentlyPlaying} token={token === null ? undefined : token.value} />
    );
  } else {
    return (
      <TrackPlaying
        current={currentlyPlaying}
        lyricDetails={lyrics}
        token={token === null ? undefined : token.value}
      />
    );
  }
};

export default LyricsView;

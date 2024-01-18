import React from "react";
import { CurrentlyPlayingState, PlayingStates } from "../../types/currentlyPlayingState";
import { ITrackLyrics } from "../../types/trackLyrics";
import Advertisement from "./Advertisement";
import Error from "./Error";
import Loading from "./Loading";
import NoTrackPlaying from "./NoTrackPlaying";
import TrackPlaying from "./TrackPlaying";
import Welcome from "./Welcome";

interface IProps {
  user: SpotifyApi.UserObjectPrivate | null;
  currentlyPlayingSong: CurrentlyPlayingState;
  lyrics: ITrackLyrics | undefined;
}

const LyricsView: React.FunctionComponent<IProps> = ({ user, currentlyPlayingSong, lyrics }) => {
  if (user === null) {
    return <Welcome />;
  } else if (currentlyPlayingSong.state === PlayingStates.Loading) {
    return <Loading />;
  } else if (currentlyPlayingSong.state === PlayingStates.NotPlaying) {
    return <NoTrackPlaying />;
  } else if (currentlyPlayingSong.state === PlayingStates.Error) {
    return <Error />;
  } else if (currentlyPlayingSong.currentlyPlayingObject.currently_playing_type === "ad") {
    return <Advertisement />;
  } else {
    return <TrackPlaying lyricDetails={lyrics} currentlyPlayingSong={currentlyPlayingSong} />;
  }
};

export default LyricsView;

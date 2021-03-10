export enum PlayingStates {
  Playing,
  NotPlaying,
  Loading,
  Error
}

interface PlayingStatePlaying {
  state: PlayingStates.Playing;
  currentlyPlayingObject: SpotifyApi.CurrentlyPlayingObject;
}

interface PlayingStateNotPlaying {
  state: PlayingStates.NotPlaying;
  currentlyPlayingObject: null;
}

interface PlayingStateLoading {
  state: PlayingStates.Loading;
  currentlyPlayingObject: null;
}

interface PlayingStateError {
  state: PlayingStates.Error;
  currentlyPlayingObject: null;
}

export type CurrentlyPlayingState =
  | PlayingStatePlaying
  | PlayingStateNotPlaying
  | PlayingStateLoading
  | PlayingStateError;

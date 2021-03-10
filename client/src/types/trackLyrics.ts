interface ILyricDetails {
  content: string;
  artist: string;
  title: string;
  geniusUrl: string;
}

export interface ITrackLyrics {
  currentlyPlayingItemId: string;
  lyrics: ILyricDetails | undefined;
}

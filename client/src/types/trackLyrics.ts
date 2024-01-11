interface ILyricDetails {
  content: string;
  artist: string;
  title: string;
  syncedLyricsArray?: Array<Object>;
  geniusUrl?: string;
}

export interface ITrackLyrics {
  currentlyPlayingItemId: string;
  lyrics: ILyricDetails | undefined;
}

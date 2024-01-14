interface ILyricDetails {
  content: string;
  artist: string;
  title: string;
  syncedLyricsArray?: Array<ILRCContent>;
}

export interface ITrackLyrics {
  currentlyPlayingItemId: string;
  lyrics: ILyricDetails | undefined;
}

export interface ILRCContent {
  content: string;
  timestamp: number;
}

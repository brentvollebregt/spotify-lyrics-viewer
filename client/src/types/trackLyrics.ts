import { ILRCContent } from "../../../src/dto";

interface ILyricDetails {
  content: string;
  artist: string;
  title: string;
  syncedLyricsArray?: Array<ILRCContent>;
  lyricsSourceReference?: string;
}

export interface ITrackLyrics {
  currentlyPlayingItemId: string;
  lyrics: ILyricDetails | undefined;
}

export type { ILRCContent };

import { Lyric } from "lrc-kit";

export interface ITokenExpiryPair {
  access_token: string;
  expires_at: number;
}

export interface IFoundLyrics {
  title: string;
  artist: string;
  plainLyrics: string | null;
  syncedLyrics: Lyric[] | null;
  attribution: string;
}

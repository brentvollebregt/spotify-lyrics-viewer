export interface ITokenExpiryPair {
  access_token: string;
  expires_at: number;
}

export interface ILyricsAndDetails {
  lyrics: string;
  title: string;
  artist: string;
  geniusUrl?: string;
  syncedLyricsArray?: Array<ILRCContent>;
}

export interface ILRCContent {
  content: string;
  timestamp: number;
}
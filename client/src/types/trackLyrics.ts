import { IFoundLyrics } from "../../../src/dto";

export interface ITrackLyrics {
  currentlyPlayingItemId: string;
  lyrics: IFoundLyrics | undefined;
}

import axios from "axios";
import { Lrc, Lyric } from "lrc-kit";
import { IFoundLyrics } from "../dto";

const LRCLIB_BASE_URL = "https://lrclib.net";
const LRCLIB_USER_AGENT =
  "Spotify Lyrics Viewer (https://github.com/brentvollebregt/spotify-lyrics-viewer)";

export async function getLyrics(
  artists: string[],
  title: string,
  albumName: string,
  durationMs: number
): Promise<IFoundLyrics | null> {
  const parameters: {
    artist_name: string;
    track_name: string;
    album_name: string;
    duration: string;
  } = {
    artist_name: artists[0],
    track_name: title,
    album_name: albumName,
    duration: (durationMs / 1000).toString()
  };

  const requestUrl = `https://lrclib.net/api/get?${new URLSearchParams(parameters)}`;

  try {
    const response = await axios.get<LrcLibGetResponse>(requestUrl, {
      headers: {
        "User-Agent": LRCLIB_USER_AGENT
      },
      validateStatus: status => status === 200 || status === 404
    });

    if (response.status === 404) {
      return null;
    }

    const data = response.data;

    if (
      (data.syncedLyrics === null || data.syncedLyrics.length === 0) &&
      (data.plainLyrics === null || data.plainLyrics === "")
    ) {
      console.warn(`Got empty response from '${requestUrl}'`);
      return null;
    }

    let syncedLyrics: Lyric[] | null = null;
    if (data.syncedLyrics != undefined) {
      try {
        const lrc = Lrc.parse(data.syncedLyrics);
        if (lrc.lyrics.length > 0) {
          syncedLyrics = lrc.lyrics;
        }
      } catch (e) {
        console.error(`Unable to parse syncedLyrics from '${requestUrl}'`);
        console.error(e);
      }
    }

    return {
      artist: response.data.artistName,
      title: response.data.trackName,
      plainLyrics: data.plainLyrics === "" ? null : data.plainLyrics,
      syncedLyrics: syncedLyrics,
      attribution: LRCLIB_BASE_URL
    } as IFoundLyrics;
  } catch (e) {
    // Anything non-200 or 404 is considered an error
    console.warn(`Failed to call '${requestUrl}'`);

    if (e instanceof Error && e.stack !== undefined) {
      console.warn(e.stack);
    }

    if (axios.isAxiosError(e)) {
      if (e.response !== undefined) {
        console.log(`Response: HTTP${e.response.status} ${e.response.statusText}`);
        console.log(`Response headers: ${JSON.stringify(e.response.headers)}`);
        console.log(`Response data: ${JSON.stringify(e.response.data)}`);
      } else {
        console.log("No response");
      }
    } else {
      console.warn(e);
    }

    return null;
  }
}

export interface LrcLibGetResponse {
  id: number;
  name: string;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  instrumental: boolean;
  lang: string;
  isrc: string;
  spotifyId: string;
  releaseDate: string;
  plainLyrics: string | null;
  syncedLyrics: string | null;
}

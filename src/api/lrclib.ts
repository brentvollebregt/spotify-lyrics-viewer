import axios from "axios";
import { ILyricsAndDetails } from "../dto";
import { Lrc } from "lrc-kit";

const LRCLIB_BASE_URL = "https://lrclib.net";

export async function getLyrics(
  artists: string[],
  title: string,
  albumName: string,
  durationMs: number
): Promise<ILyricsAndDetails> {
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

  try {
    const response = await axios.get(
      `https://lrclib.net/api/get?${new URLSearchParams(parameters)}`
    );
    const data = response.data;
    let syncedLyricsArray = Array();
    if (data.syncedLyrics != undefined) {
      try {
        const lrc = Lrc.parse(data.syncedLyrics);
        syncedLyricsArray = syncedLyricsArray.concat(lrc.lyrics);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      artist: artists[0],
      title: title,
      lyrics: data.plainLyrics,
      syncedLyricsArray,
      lyricsSourceReference: LRCLIB_BASE_URL
    };
  } catch (e) {
    //accounting for lrclib outage
    return { artist: artists[0], title: title, lyrics: null, syncedLyricsArray: [] };
  }
}

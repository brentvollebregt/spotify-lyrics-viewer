import { useEffect, useState } from "react";
import { getLyrics } from "../api";
import { CurrentlyPlayingState, PlayingStates } from "../types/currentlyPlayingState";
import { ILRCContent } from "../types/trackLyrics";

interface ILyricDetails {
  content: string;
  artist: string;
  title: string;
  syncedLyricsArray?: Array<ILRCContent>;
  lyricsSourceReference?: string;
}

interface ITrackLyrics {
  currentlyPlayingItemId: string;
  lyrics: ILyricDetails | undefined;
}

const useLyrics = (currentlyPlaying: CurrentlyPlayingState) => {
  const [lyrics, setLyrics] = useState<ITrackLyrics | undefined>(undefined); // undefined = no lyrics yet, .lyrics=undefined = no lyrics exist

  useEffect(() => {
    // Get new lyrics when the current playing item changes
    if (
      (currentlyPlaying.state !== PlayingStates.Playing &&
        currentlyPlaying.state !== PlayingStates.Paused) ||
      currentlyPlaying.currentlyPlayingObject.item === null
    ) {
      setLyrics(undefined);
    } else {
      if (
        lyrics === undefined || // We just don't have the lyrics
        currentlyPlaying.currentlyPlayingObject.item.id !== lyrics.currentlyPlayingItemId || // Song has changed
        lyrics.lyrics?.content === "" // The lyrics are empty for some reason
      ) {
        // Only remove the current lyrics if they aren't empty for some reason (to keep the "Trying again" message)
        if (!(lyrics?.lyrics?.content === "")) {
          setLyrics(undefined);
        }

        // Make replacements to track names to help better find lyrics
        const trackNameWithReplacements = currentlyPlaying.currentlyPlayingObject.item.name
          .replace(/ \(feat.+\)/i, "") // Remove (feat. ...)
          .replace(/ \(ft.+\)/i, "") // Remove (ft. ...)
          .replace(/ \(with.+\)/i, "") // Remove (with. ...)
          .replace(/ - \d{4} - Remaster/i, "") // Remove "- 2021 - Remaster"
          .replace(/ - (\d{4} )?Remaster(ed)?.*/i, "") // Remove "- Remastered" and "- 2016 Remastered" and "- Remastered 2011" and " - 2016 Remaster"
          .replace(/ - Original Album Version/i, "") // Remove "- Original Album Version"
          .replace(/ \(Live\)/i, "") // Remove " (Live)"
          .replace(/ - Acoustic/i, "") // Remove " - Acoustic"
          .replace(/ - from .*/i, "") // Remove " - from ..."
          .replace(/ - Live from .*/i, "") // Remove " - Live from ..."
          .replace(/ - Live/i, "") // Remove " - Live"
          .replace(/ - \d{4} Mix/i, "") // Remove " - 2023 Mix"
          .trim();

        // Get lyrics
        getLyrics(
          currentlyPlaying.currentlyPlayingObject.item.artists.map(x => x.name),
          trackNameWithReplacements,
          currentlyPlaying.currentlyPlayingObject.item.album.name,
          currentlyPlaying.currentlyPlayingObject.item.duration_ms
        ).then(newLyrics => {
          if (currentlyPlaying.currentlyPlayingObject.item !== null) {
            setLyrics({
              currentlyPlayingItemId: currentlyPlaying.currentlyPlayingObject.item.id,
              lyrics:
                newLyrics === null
                  ? undefined
                  : {
                      artist: newLyrics.artist,
                      content: newLyrics.lyrics,
                      title: newLyrics.title,
                      syncedLyricsArray: newLyrics.syncedLyricsArray,
                      lyricsSourceReference: newLyrics.lyricsSourceReference
                    }
            });
          }
        });
      }
    }
  }, [currentlyPlaying]);

  return lyrics;
};

export default useLyrics;

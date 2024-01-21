import { useEffect, useState } from "react";
import { IFoundLyrics } from "../../../src/dto";
import { getLyrics } from "../api";
import { CurrentlyPlayingState, PlayingStates } from "../types/currentlyPlayingState";
import { ITrackLyrics } from "../types/trackLyrics";

const getLyricsPromiseCache: Record<string, Promise<IFoundLyrics | null>> = {};

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
      const hasSongChanged =
        currentlyPlaying.currentlyPlayingObject.item.id !== lyrics?.currentlyPlayingItemId;
      const lyricsAreEmpty =
        lyrics?.lyrics?.plainLyrics === undefined &&
        (lyrics?.lyrics?.syncedLyrics ?? undefined) === undefined;
      if (lyrics === undefined || hasSongChanged || lyricsAreEmpty) {
        // Only remove the current lyrics if they aren't empty for some reason (to keep the "Trying again" message)
        if (!lyricsAreEmpty) {
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
        const getLyricsPromiseCacheKey = JSON.stringify({
          artists: currentlyPlaying.currentlyPlayingObject.item.artists.map(x => x.name),
          title: trackNameWithReplacements,
          album: currentlyPlaying.currentlyPlayingObject.item.album.name
        });

        const getLyricsPromise =
          getLyricsPromiseCache[getLyricsPromiseCacheKey] ??
          getLyrics(
            currentlyPlaying.currentlyPlayingObject.item.artists.map(x => x.name),
            trackNameWithReplacements,
            currentlyPlaying.currentlyPlayingObject.item.album.name,
            currentlyPlaying.currentlyPlayingObject.item.duration_ms
          );
        getLyricsPromiseCache[getLyricsPromiseCacheKey] = getLyricsPromise;

        let didCancel = false;
        const processPromise = async () => {
          const getLyricsResult = await getLyricsPromise;

          if (didCancel) {
            return;
          }

          if (currentlyPlaying.currentlyPlayingObject.item !== null) {
            setLyrics({
              currentlyPlayingItemId: currentlyPlaying.currentlyPlayingObject.item.id,
              lyrics: getLyricsResult ?? undefined
            });
          }
        };
        processPromise();
        return () => {
          didCancel = true;
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlyPlaying]);

  return lyrics;
};

export default useLyrics;

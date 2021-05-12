import { useEffect, useState } from "react";

import { geniusGetLyrics } from "../api";
import { CurrentlyPlayingState, PlayingStates } from "../types/currentlyPlayingState";

interface ILyricDetails {
  content: string;
  artist: string;
  title: string;
  geniusUrl: string;
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
      currentlyPlaying.state !== PlayingStates.Playing ||
      currentlyPlaying.currentlyPlayingObject.item === null
    ) {
      setLyrics(undefined);
    } else {
      if (
        lyrics === undefined || // We just don't have the lyrics
        currentlyPlaying.currentlyPlayingObject.item.id !== lyrics.currentlyPlayingItemId || // Song has changed
        (lyrics.lyrics !== undefined && lyrics.lyrics.content === "") // The lyrics are empty for some reason
      ) {
        // Only remove the current lyrics if they aren't empty for some reason (to keep the "Trying again" message)
        if (
          !(lyrics !== undefined && lyrics.lyrics !== undefined && lyrics.lyrics.content === "")
        ) {
          setLyrics(undefined);
        }

        // Make replacements to track names to help better find lyrics
        const trackNameWithReplacements = currentlyPlaying.currentlyPlayingObject.item.name
          .replace(/\((feat\.|ft\.|with).+\)/, "")
          .trim();

        // Get lyrics
        geniusGetLyrics(
          currentlyPlaying.currentlyPlayingObject.item.artists.map(x => x.name),
          trackNameWithReplacements
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
                      geniusUrl: newLyrics.geniusUrl,
                      title: newLyrics.title
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

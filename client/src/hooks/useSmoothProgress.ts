import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";

import { IToken } from "../types/token";
import { responseError } from "../utils";

const useSmoothProgress = (
  progressMs: number,
  duration: number,
  isPlaying: boolean,
  token: IToken | null
) => {
  const [progress, setProgress] = useState(0);
  const [userSlidingProgress, setUserSlidingProgress] = useState(false);
  const [smoothProgressTimer, setSmoothProgressTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Use the current progress when the user is not sliding
    if (!userSlidingProgress) {
      setProgress(progressMs);
    }
  }, [userSlidingProgress, progressMs]);

  useEffect(() => {
    // Smoother progress bar
    if (smoothProgressTimer !== null) {
      clearTimeout(smoothProgressTimer);
    }

    const smoothingDelay = 500;
    setSmoothProgressTimer(
      setInterval(() => {
        if (!userSlidingProgress && isPlaying) {
          setProgress(value => Math.min(value + smoothingDelay, duration));
        }
      }, smoothingDelay)
    );

    return () => {
      if (smoothProgressTimer !== null) {
        clearTimeout(smoothProgressTimer);
      }
    };
  }, [userSlidingProgress, isPlaying]);

  const onUserStartSliding = () => setUserSlidingProgress(true);
  const onUserFinishedSliding = () => {
    setUserSlidingProgress(false);
    if (token !== null) {
      const spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(token.value);
      spotifyApi.seek(progress).catch(e => responseError("Failed to Seek", e));
    }
  };
  const onUserSlide = (event: React.ChangeEvent<{}>, value: number | number[]) =>
    setProgress(Array.isArray(value) ? value[0] : value);

  return { onUserStartSliding, onUserFinishedSliding, onUserSlide, progress };
};

export default useSmoothProgress;

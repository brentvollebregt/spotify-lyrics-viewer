import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { IToken } from "../types/token";
import { responseError } from "../utils";

const useSmoothProgress = (
  progressMs: number,
  duration: number,
  isPlaying: boolean,
  token: IToken | null,
  smoothingDelay: number = 500
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSlidingProgress, isPlaying, duration]);

  const onUserFinishedSliding = (event: React.ChangeEvent<{}>, value: number | number[]) => {
    const newProgress = Array.isArray(value) ? value[0] : value;
    setProgress(newProgress);

    setUserSlidingProgress(false);
    if (token !== null) {
      const spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(token.value);
      spotifyApi.seek(progress).catch(e => responseError("Failed to Seek", e));
    }
  };
  const onUserSlide = (event: React.ChangeEvent<{}>, value: number | number[]) => {
    setUserSlidingProgress(true);
    setProgress(Array.isArray(value) ? value[0] : value);
  };

  return { onUserFinishedSliding, onUserSlide, progress };
};

export default useSmoothProgress;

import cogoToast from "cogo-toast";
import { useEffect, useState } from "react";
import { spotifyRefreshToken } from "../api";
import { IToken } from "../types/token";

const useTokenRefresh = (
  token: IToken | null,
  onNewToken: (accessToken: string, expiresAt: number) => void,
  clearToken: () => void
) => {
  const [tokenTimeout, setTokenTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Request for a new token before expiry
    if (tokenTimeout !== null) {
      clearTimeout(tokenTimeout);
    }

    if (token !== null) {
      const timeToRefresh = token.expiry.getTime() - new Date().getTime() - 60 * 1000; // (future - now) - 1min
      setTokenTimeout(
        setTimeout(() => {
          spotifyRefreshToken().then(newToken => {
            if (newToken !== null) {
              onNewToken(newToken.access_token, newToken.expires_at);
            } else {
              const { hide } = cogoToast.warn(
                "Unable to keep logged into Spotify. Please log back in.",
                {
                  position: "bottom-center",
                  heading: "Spotify Login Expired",
                  hideAfter: 20,
                  onClick: () => hide !== undefined && hide()
                }
              );
              clearToken();
            }
          });
        }, timeToRefresh)
      );
    }

    return () => {
      if (tokenTimeout !== null) {
        clearTimeout(tokenTimeout);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
};

export default useTokenRefresh;

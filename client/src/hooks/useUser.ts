import cogoToast from "cogo-toast";
import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { IToken } from "../types/token";

const useUser = (token: IToken | null, clearToken: () => void) => {
  const [user, setUser] = useState<SpotifyApi.UserObjectPrivate | null>(null);

  // Request the user when the token changes
  useEffect(() => {
    if (token === null) {
      setUser(null);
    } else {
      const spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(token.value);
      spotifyApi
        .getMe()
        .then(newUser => setUser(newUser))
        .catch(err => {
          console.error(err);
          const { hide } = cogoToast.error(
            "Could not get your profile. Make sure you are connected to the internet and that cookies are allowed.",
            {
              position: "bottom-center",
              heading: "Error When Fetching Your Profile",
              hideAfter: 20,
              onClick: () => hide !== undefined && hide()
            }
          );
        });
    }
  }, [token]);

  return user;
};

export default useUser;

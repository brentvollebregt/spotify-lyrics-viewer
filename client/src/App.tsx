import React, { useEffect, useState } from "react";
import { useRoutes, useRedirect } from "hookrouter";
import SpotifyWebApi from "spotify-web-api-js";
import cogoToast from "cogo-toast";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import About from "./pages/About";
import LyricsView from "./pages/LyricsView";
import NotFound from "./pages/NotFound";
import SpotifyAuthorization from "./pages/SpotifyAuthorization";
import { deleteSession, spotifyGetCurrentToken, spotifyRefreshToken } from "./api";
import { IToken } from "./models";
import MetaTags from "./components/MetaTags";

const App: React.FC = () => {
  const [token, setToken] = useState<IToken | null>(null);
  const [user, setUser] = useState<SpotifyApi.UserObjectPrivate | null>(null);
  const [tokenTimeout, setTokenTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Request the user when the token changes
    if (token === null) {
      setUser(null);
    } else {
      const spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(token.value);
      spotifyApi
        .getMe()
        .then(newUser => setUser(newUser))
        .catch(err => {
          const { hide } = cogoToast.error(
            "Could not get your profile. Make sure you are connected to the internet and that your token is valid.",
            {
              position: "bottom-center",
              heading: "Error When Fetching Your Profile",
              hideAfter: 20,
              onClick: () => hide()
            }
          );
        });
    }
  }, [token]);

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
                  onClick: () => hide()
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
  }, [token]);

  useEffect(() => {
    // Request for a token on load to see if data is already in the state
    spotifyGetCurrentToken().then(newToken => {
      if (newToken !== null) {
        onNewToken(newToken.access_token, newToken.expires_at);
      }
    });
  }, []);

  const onNewToken = (accessToken: string, expiresAt: number) => {
    setToken({ expiry: new Date(expiresAt), value: accessToken });
  };
  const clearToken = () => {
    setToken(null);
    deleteSession();
  };

  const routes = {
    "/": () => (
      <MetaTags
        route="/"
        description="View the lyrics of the current song playing on your Spotify account in your browser."
      >
        <LyricsView token={token} invalidateToken={clearToken} />
      </MetaTags>
    ),
    "/about": () => (
      <MetaTags
        route="/about"
        titlePrefix="About - "
        description="Spotify Lyrics Viewer is a tool that allows you to view the lyrics of the current playing song on Spotify."
      >
        <About />
      </MetaTags>
    ),
    "/spotify-authorization": () => <SpotifyAuthorization onNewToken={onNewToken} />,
    "/spotify-authorization/": () => <SpotifyAuthorization onNewToken={onNewToken} />
  };
  const routeResult = useRoutes(routes);
  useRedirect("/about/", "/about");

  return (
    <>
      <Navigation user={user} onLogout={clearToken} />
      <div className="my-3">{routeResult || <NotFound />}</div>
      <Footer />
    </>
  );
};

export default App;

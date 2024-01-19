const getTrackCheckDelaySeconds = () => {
  const rawValue = process.env.REACT_APP_TRACK_CHECK_DELAY_SECONDS ?? "";
  if (rawValue === "") {
    return 1;
  }
  const intValue = parseInt(rawValue);
  if (isNaN(intValue)) {
    return 1;
  }
  return Math.max(intValue, 1);
};

const config = {
  api: {
    root: process.env.REACT_APP_API_ROOT ? process.env.REACT_APP_API_ROOT : window.location.origin,
    spotify_authentication_route: "/api/spotify/authenticate"
  },
  siteUrl: "https://spotify-lyrics-viewer.nitratine.net",
  client: {
    basename: process.env.REACT_APP_BASENAME,
    trackCheckDelaySeconds: getTrackCheckDelaySeconds()
  }
};

export default config;

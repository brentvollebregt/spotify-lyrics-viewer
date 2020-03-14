export default {
  api: {
    root: process.env.REACT_APP_API_ROOT
      ? process.env.REACT_APP_API_ROOT
      : window.location.origin,
    spotify_authentication_route: "/api/spotify/authenticate"
  },
  siteUrl: "https://spotify-lyrics-viewer.nitratine.net"
};

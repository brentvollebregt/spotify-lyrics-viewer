const config = {
  client: {
    relative_build_directory: "../client/build",
    routes: ["/", "/about", "/spotify-authorization"],
    subdirectory: process.env.CLIENT_DEPLOYMENT_SUBDIRECTORY ?? ""
  },
  genius: {
    access_token: process.env.GENIUS_ACCESS_TOKEN
  },
  server: {
    allowed_origins: process.env.SERVER_ALLOWED_ORIGINS.split(","),
    session_keys: process.env.SERVER_SESSION_KEYS.split(" ")
  },
  spotify: {
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    permission_scope: "user-modify-playback-state user-read-playback-state"
  }
};

export default config;

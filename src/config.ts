const serverAllowedOrigins = process.env.SERVER_ALLOWED_ORIGINS;
if (serverAllowedOrigins === undefined || serverAllowedOrigins === "") {
  throw new Error("SERVER_ALLOWED_ORIGINS has not been set");
}
const serverSessionKeys = process.env.SERVER_SESSION_KEYS;
if (serverSessionKeys === undefined || serverSessionKeys === "") {
  throw new Error("SERVER_SESSION_KEYS has not been set");
}
const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
if (spotifyClientId === undefined || spotifyClientId === "") {
  throw new Error("SPOTIFY_CLIENT_ID has not been set");
}
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
if (spotifyClientSecret === undefined || spotifyClientSecret === "") {
  throw new Error("SPOTIFY_CLIENT_SECRET has not been set");
}

const config = {
  client: {
    relative_build_directory: "../client/build",
    routes: ["/", "/about", "/spotify-authorization"],
    subdirectory: process.env.CLIENT_DEPLOYMENT_SUBDIRECTORY ?? ""
  },
  genius: {
    access_token:
      process.env.GENIUS_ACCESS_TOKEN === "" ? undefined : process.env.GENIUS_ACCESS_TOKEN
  },
  server: {
    allowed_origins: serverAllowedOrigins.split(","),
    session_keys: serverSessionKeys.split(" ")
  },
  spotify: {
    client_id: spotifyClientId,
    client_secret: spotifyClientSecret,
    permission_scope: "user-modify-playback-state user-read-playback-state"
  }
};

export default config;

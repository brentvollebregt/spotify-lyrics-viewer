export default {
    genius: {
        access_token: process.env.GENIUS_ACCESS_TOKEN
    },
    server: {
        allowed_origins: process.env.SERVER_ALLOWED_ORIGINS
    },
    spotify: {
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET
    }
};

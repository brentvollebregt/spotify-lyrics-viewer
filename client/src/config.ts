export default {
    api: {
        root: process.env.NODE_ENV === 'production' ? window.location.origin : process.env.REACT_APP_API_ROOT
    },
    spotify: {
        client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
        permission_scope: 'user-modify-playback-state user-read-playback-state'
    }
};

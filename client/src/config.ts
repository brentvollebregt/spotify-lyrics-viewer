export default {
    api: {
        root: process.env.NODE_ENV === 'production' ? window.location.origin : process.env.REACT_APP_API_ROOT,
        spotify_authentication_route: '/api/spotify/authenticate'
    }
};

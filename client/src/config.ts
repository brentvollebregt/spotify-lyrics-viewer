export default {
    api: {
        root: process.env.REACT_APP_API_ROOT ? process.env.REACT_APP_API_ROOT : window.location.origin,
        // root: process.env.NODE_ENV === 'production' ? window.location.origin : process.env.REACT_APP_API_ROOT,
        spotify_authentication_route: '/api/spotify/authenticate'
    }
};

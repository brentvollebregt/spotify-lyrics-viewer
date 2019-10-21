import express from "express";
import SpotifyWebApi from 'spotify-web-api-node';
import Config from '../config';
import { randomString } from '../utils';

export const subRoute = '/api/spotify';
const getRedirectUri = (host: string) => `http://${host}${subRoute}/authentication-callback`;

const router = express.Router();

router.get('/authenticate', (req, res) => {
    const spotifyApi = new SpotifyWebApi({
        clientId: Config.spotify.client_id,
        redirectUri: getRedirectUri(req.headers.host)
    });
    const state = randomString(16);
    const authorizeURL = spotifyApi.createAuthorizeURL(Config.spotify.permission_scope.split(' '), state);

    req.session.authentication_state = state;
    req.session.expires_in = undefined;
    req.session.access_token = undefined;
    req.session.refresh_token = undefined;
    res.redirect(authorizeURL);
    res.end();
});

router.get('/authentication-callback', async (req, res) => {
    const { code, state } = req.query;

    // Verify state is expected
    if (state !== req.session.authentication_state) {
        res.status(400).send('Unexpected state value');
        return;
    }
    req.session.authentication_state = undefined;

    // Get an access and refresh token
    const spotifyApi = new SpotifyWebApi({
        clientId: Config.spotify.client_id,
        clientSecret: Config.spotify.client_secret,
        redirectUri: getRedirectUri(req.headers.host)
    });

    const authorizationResponse = await spotifyApi.authorizationCodeGrant(code);
    req.session.expires_in = authorizationResponse.body.expires_in;
    req.session.access_token = authorizationResponse.body.access_token;
    req.session.refresh_token = authorizationResponse.body.refresh_token;

    res.json({ success: true, token: authorizationResponse.body.access_token });
    res.end();
});

router.get('/refresh-token', async (req, res) => {
    const spotifyApi = new SpotifyWebApi({
        clientId: Config.spotify.client_id,
        clientSecret: Config.spotify.client_secret,
        redirectUri: getRedirectUri(req.headers.host)
    });
    spotifyApi.setAccessToken(req.session.access_token);
    spotifyApi.setRefreshToken(req.session.refresh_token);

    const refreshResponse = await spotifyApi.refreshAccessToken().catch(e => {
        console.error(e);
    });
    if (refreshResponse) {
        res.json(refreshResponse.body);
    }
    // req.session.expires_in = refreshResponse.body.expires_in;
    // req.session.access_token = refreshResponse.body.access_token;

    // res.json({ success: true, token: refreshResponse.body.access_token });
    res.end();
});

export default router;

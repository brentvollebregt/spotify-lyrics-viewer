import express from "express";
import SpotifyWebApi from "spotify-web-api-node";
import Config from "../config";
import { randomString } from "../utils";
import { isStoredTokenValid } from "../utils/spotify";
import { ITokenExpiryPair } from "../dto";
import { URLSearchParams } from "url";

export const subRoute = "/api/spotify";

const getRedirectUri = (protocol: string, host: string) =>
  `${protocol}://${host}${subRoute}/authentication-callback`;
const millisecondsOffsetFromNow = (offset: number) => new Date().getTime() + offset * 1000;

const router = express.Router();

router.get("/authenticate", (req, res) => {
  // Auth: https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow
  // Setup API object
  const redirectUri = getRedirectUri(req.protocol, req.headers.host);
  const spotifyApi = new SpotifyWebApi({
    clientId: Config.spotify.client_id,
    redirectUri
  });
  const state = randomString(16);

  // Make the call and clear the session
  const authorizeURL = spotifyApi.createAuthorizeURL(
    Config.spotify.permission_scope.split(" "),
    state
  );
  req.session.authentication_state = state;
  req.session.authentication_origin = req.headers.referer;
  req.session.redirected_uri = redirectUri;
  req.session.expires_at = undefined;
  req.session.access_token = undefined;
  req.session.refresh_token = undefined;

  // Redirect user
  res.redirect(authorizeURL);
  res.end();
});

router.get("/authentication-callback", async (req, res) => {
  const { code, state } = req.query;

  // Verify this request is expected (using the state value)
  if (state === undefined || state !== req.session.authentication_state) {
    res.status(400).send("Unexpected state value");
    res.end();
    return;
  }
  req.session.authentication_state = undefined;

  // Pull out origin to redirect to and clear it
  let originToRedirectTo = req.session.authentication_origin;
  if (req.headers.referer) {
    // Extract the base URL from the Referer header
    const refererUrl = new URL(req.headers.referer);
    originToRedirectTo = `${refererUrl.origin}${refererUrl.pathname}`;
  }

  req.session.authentication_origin = undefined;

  // Setup API object (and clear used redirect uri)
  const spotifyApi = new SpotifyWebApi({
    clientId: Config.spotify.client_id,
    clientSecret: Config.spotify.client_secret,
    redirectUri: req.session.redirected_uri
  });
  req.session.redirected_uri = undefined;

  // Make the call and put data into the session
  const authorizationResponse = await spotifyApi.authorizationCodeGrant(code);
  req.session.expires_at = millisecondsOffsetFromNow(authorizationResponse.body.expires_in);
  req.session.access_token = authorizationResponse.body.access_token;
  req.session.refresh_token = authorizationResponse.body.refresh_token;

  // Redirect user with values
  const responseData: ITokenExpiryPair = {
    access_token: req.session.access_token,
    expires_at: req.session.expires_at
  };
  const redirectUrl = `${originToRedirectTo}spotify-lyrics-viewer?${new URLSearchParams(
    responseData as any
  )}`;
  console.log(redirectUrl);
  res.redirect(redirectUrl);
  res.end();
});

router.get("/token", (req, res) => {
  // Verify the data in the session is sufficient to fulfil this request
  if (!isStoredTokenValid(req)) {
    res.status(401).send("No token available");
    res.end();
    return;
  }

  // Respond with the updated values
  const responseData: ITokenExpiryPair = {
    access_token: req.session.access_token,
    expires_at: req.session.expires_at
  };
  res.json(responseData);
  res.end();
});

router.get("/refresh-token", async (req, res) => {
  // Verify the data in the session is sufficient to fulfil this request
  if (!isStoredTokenValid(req)) {
    res.status(401).send("No token available");
    res.end();
    return;
  }

  // Setup API object
  const spotifyApi = new SpotifyWebApi({
    clientId: Config.spotify.client_id,
    clientSecret: Config.spotify.client_secret,
    redirectUri: getRedirectUri(req.protocol, req.headers.host)
  });
  spotifyApi.setAccessToken(req.session.access_token);
  spotifyApi.setRefreshToken(req.session.refresh_token);

  // Make the call and put data into the session
  const refreshResponse = await spotifyApi.refreshAccessToken();
  req.session.expires_at = millisecondsOffsetFromNow(refreshResponse.body.expires_in);
  req.session.access_token = refreshResponse.body.access_token;

  // Respond with the updated values
  const responseData: ITokenExpiryPair = {
    access_token: req.session.access_token,
    expires_at: req.session.expires_at
  };
  res.json(responseData);
  res.end();
});

export default router;

import dotenv from "dotenv";
dotenv.config(); // Setup .env

import express from "express";
import cookieSession from "cookie-session";
import path from "path";
import Config from './config';
import GeniusRoutes, { subRoute as geniusSubRoute } from "./routes/genius";
import SessionRoutes, { subRoute as sessionSubRoute } from "./routes/session";
import SpotifyRoutes, { subRoute as spotifySubRoute } from "./routes/spotify";

const app = express();

app.set('trust proxy', 1); // Trust first proxy

app.use(express.json());

// Session
app.use(cookieSession({
    keys: Config.server.session_keys,
    maxAge: 48 * 60 * 60 * 1000, // Expires in 48 hours
    secure: app.get('env') === 'production' // SSL is only used in prod
}));

// CORS
app.use((req, res, next) => {
    const origin = req.get('origin') || req.get('referrer');
    if (Config.server.allowed_origins.indexOf(origin) !== -1) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Static files from the React app
const clientBuildDirectory = path.join(__dirname, Config.client.relative_build_directory);
app.use(express.static(clientBuildDirectory)); // Non-index.html files
Config.client.routes.forEach(route =>
    app.use(route, express.static(path.join(clientBuildDirectory, 'index.html')))
);

// API Endpoints
app.use(geniusSubRoute, GeniusRoutes);
app.use(sessionSubRoute, SessionRoutes);
app.use(spotifySubRoute, SpotifyRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});

import dotenv from "dotenv";
dotenv.config(); // Setup .env

import express from "express";
import cookieSession from "cookie-session";
import path from "path";
import Config from './config';
import GeniusRoutes, { subRoute as geniusSubRoute } from "./routes/genius";
import SpotifyRoutes, { subRoute as spotifySubRoute } from "./routes/spotify";

const app = express();

app.set('trust proxy', 1); // Trust first proxy

app.use(express.json());

// Session
app.use(cookieSession({
    name: 'session',
    keys: Config.server.session_keys,
    // Cookie Options
    maxAge: 48 * 60 * 60 * 1000, // 48 hours
    secure: app.get('env') === 'production'
}));

// CORS
app.use((req, res, next) => {
    const origin = req.get('origin') || req.get('referrer');
    if (Config.server.allowed_origins.indexOf(origin) !== -1) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
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
app.use(spotifySubRoute, SpotifyRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});

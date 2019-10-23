import dotenv from "dotenv";
dotenv.config(); // Setup .env

import express from "express";
import session from 'express-session';
import path from "path";
import Config from './config';
import GeniusRoutes, { subRoute as geniusSubRoute } from "./routes/genius";
import SpotifyRoutes, { subRoute as spotifySubRoute } from "./routes/spotify";

const app = express();

app.use(express.json());

// Session
app.use(session({
    cookie: {
        secure: app.get('env') === 'production'
    },
    resave: false,
    saveUninitialized: true,
    secret: Config.server.secret
}));

// CORS
app.use((req, res, next) => {
    const origin  = req.get('origin') || req.get('referrer');
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

import dotenv from "dotenv";
dotenv.config(); // Setup .env

import express from "express";
import path from "path";
import Config from './config';
import GeniusRoutes from "./routes/genius";
import SpotifyRoutes from "./routes/spotify";

const app = express();

app.use(express.json());

app.use((req, res, next) => { // CORS
    const origin  = req.get('origin') || req.get('referrer');
    if (Config.server.allowed_origins.indexOf(origin) !== -1) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
});

app.use(express.static(path.join(__dirname, "client/build"))); // Serve static files from the React app
app.use('/api/genius', GeniusRoutes);
app.use('/api/spotify', SpotifyRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});

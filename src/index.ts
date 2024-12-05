import dotenv from "dotenv";
dotenv.config(); // Setup .env

import cookieSession from "cookie-session";
import express from "express";
import fs from "fs";
import https from "https";
import path from "path";
import Config from "./config";
import LyricsRoutes, { subRoute as lyricsSubRoute } from "./routes/lyrics";
import SessionRoutes, { subRoute as sessionSubRoute } from "./routes/session";
import SpotifyRoutes, { subRoute as spotifySubRoute } from "./routes/spotify";

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  if (reason instanceof Error) {
    console.error(reason.stack);
  }
});

const app = express();
const isProduction = app.get("env") === "production";

app.set("trust proxy", 1); // Trust first proxy

app.use(express.json());

// Session
app.use(
  cookieSession({
    keys: Config.server.session_keys,
    maxAge: 48 * 60 * 60 * 1000, // Expires in 48 hours
    sameSite: "none",
    secure: true // This is why we need SSL in dev
  })
);

// CORS
app.use((req, res, next) => {
  const origin = req.get("origin") ?? req.get("referrer");
  if (origin !== undefined && Config.server.allowed_origins.indexOf(origin) !== -1) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Max-Age", "600");
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Static files from the React app
const clientBuildDirectory = path.join(__dirname, Config.client.relative_build_directory);
app.use(express.static(clientBuildDirectory)); // Non-index.html files
Config.client.routes.forEach(route =>
  app.use(route, express.static(path.join(clientBuildDirectory, "index.html")))
);

// API Endpoints
app.use(sessionSubRoute, SessionRoutes);
app.use(spotifySubRoute, SpotifyRoutes);
app.use(lyricsSubRoute, LyricsRoutes);

const port = process.env.PORT || 5000;

if (!isProduction) {
  // Even when running locally, we need to use HTTPS. Read the README for details.
  https
    .createServer(
      {
        cert: fs.readFileSync("server.cert"),
        key: fs.readFileSync("server.key")
      },
      app
    )
    .listen(port, () => {
      console.log(`Listening on ${port} with HTTPS`);
    });
} else {
  app.listen(port, () => {
    console.log(`Listening on ${port}`);
  });
}

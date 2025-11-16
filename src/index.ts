import dotenv from "dotenv";
dotenv.config(); // Setup .env

import express from "express";
import session from "express-session";
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

app.set("trust proxy", 1);
app.use(express.json());

// iOS-proof session
app.use(
  session({
    secret: Config.server.session_keys[0],
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 48 * 60 * 60 * 1000
    }
  })
);

// CORS (iOS-friendly)
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && Config.server.allowed_origins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  next();
});

// Static files from the React app
const clientBuildDirectory = path.join(__dirname, Config.client.relative_build_directory);
app.use(express.static(clientBuildDirectory));

Config.client.routes.forEach(route => {
  app.use(route, express.static(path.join(clientBuildDirectory, "index.html")));
});

// API Endpoints
app.use(sessionSubRoute, SessionRoutes);
app.use(spotifySubRoute, SpotifyRoutes);
app.use(lyricsSubRoute, LyricsRoutes);

const port = process.env.PORT || 5000;

if (!isProduction) {
  // Even when running locally, we need to use HTTPS. Read the
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

import express from "express";
import { getLyrics as getLyricsFromGenius } from "../api/genius";
import { getLyrics as getLyricsFromLrcLib } from "../api/lrclib";
import config from "../config";

export const subRoute = "/api/lyrics";

const router = express.Router();

router.get("/", async (req, res) => {
  // Verify expected parameters have been provided
  const {
    artists,
    title,
    albumName,
    duration
  }: {
    artists: string | string[] | undefined;
    title: string | undefined;
    albumName: string | undefined;
    duration: number | undefined;
  } = req.query;
  if (
    artists === undefined ||
    title === undefined ||
    albumName === undefined ||
    duration === undefined
  ) {
    res.status(400).send("Please provide an 'artists', 'title', 'albumName', and 'duration'");
    res.end();
    return;
  }

  // If only one artist came in, it will be a string
  const artistArray = typeof artists === "string" ? [artists] : artists;

  // First try to search directly for the song at lrclib.net
  const lyricsFromLrcLib = await getLyricsFromLrcLib(artistArray, title, albumName, duration);
  if (lyricsFromLrcLib !== null) {
    res.send(lyricsFromLrcLib);
    res.end();
    return;
  }

  // TODO Try https://lrclib.net/api/search?q=Power+And+The+Passion+Midnight+Oil+10%2C9%2C8%2C7%2C6%2C5%2C4%2C3%2C2%2C1

  // If everything fails, try Genius (if enabled)
  if (config.genius.access_token !== undefined) {
    const lyricsFromGenius = await getLyricsFromGenius(
      artistArray,
      title,
      albumName,
      duration,
      config.genius.access_token
    );
    if (lyricsFromGenius !== null) {
      res.send(lyricsFromGenius);
      res.end();
      return;
    }
  }

  // If we get here, nothing was found
  res.status(404).send("Unable to find lyrics");
  res.end();
});

export default router;

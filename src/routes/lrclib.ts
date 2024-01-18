import express from "express";
import { getLyrics } from "../api/lrclib";
import { searchForMostProbableLyricsHit } from "../utils/genius";
import { getLyrics as fallbackLyrics } from "../api/genius";

export const subRoute = "/api/lrclib";

const router = express.Router();

router.get("/lyrics", async (req, res) => {
  // Verify expected parameters have been provided
  let {
    artists,
    title,
    albumName,
    duration
  }: { artists: string | string[]; title: string; albumName: string; duration: number } = req.query;
  if (artists === undefined || title === undefined) {
    res.status(400).send("Please provide an artist and title");
    res.end();
    return;
  }

  // If only one artist came in, it will be a string
  if (typeof artists === "string") {
    artists = [artists];
  }

  const lyricsAndDetails = await getLyrics(artists, title, albumName, duration);
  if (!lyricsAndDetails.lyrics || lyricsAndDetails.lyrics === "") {
    const bestSearchResults = await searchForMostProbableLyricsHit(artists, title);

    // Verify a match was found
    if (bestSearchResults === null) {
      res.status(404).send("Unable to find lyrics");
      res.end();
      return;
    }

    const lyricsAndDetails = await fallbackLyrics(bestSearchResults.path);
    res.send(lyricsAndDetails);
    res.end();
    return;
  }

  res.send(lyricsAndDetails);
  res.end();
});

export default router;

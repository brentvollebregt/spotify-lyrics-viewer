import express from "express";
import { searchForMostProbableLyricsHit } from "../utils/genius";
import { getLyrics } from "../api/genius";

export const subRoute = "/api/genius";

const router = express.Router();

router.get("/lyrics", async (req, res) => {
  // Verify expected parameters have been provided
  let { artists, title }: { artists: string | string[]; title: string } = req.query;
  if (artists === undefined || title === undefined) {
    res.status(400).send("Please provide an artist and title");
    res.end();
    return;
  }

  // If only one artist came in, it will be a string
  if (typeof artists === "string") {
    artists = [artists];
  }

  const bestSearchResults = await searchForMostProbableLyricsHit(artists, title);

  // Verify a match was found
  if (bestSearchResults === null) {
    res.status(404).send("Unable to find lyrics");
    res.end();
    return;
  }

  const lyricsAndDetails = await getLyrics(bestSearchResults.path);
  res.send(lyricsAndDetails);
  res.end();
});

export default router;

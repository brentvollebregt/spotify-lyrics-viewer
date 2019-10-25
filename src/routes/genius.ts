import express from "express";
import { getLyrics, search } from '../api/genius';

export const subRoute = '/api/genius';

const router = express.Router();

router.get('/lyrics', async (req, res) => {
    // Verify expected parameters have been provided
    const { artist, title } = req.query;
    if (artist === undefined || title === undefined) {
        res.status(400).send('Please provide an artist and title');
        res.end();
        return;
    }

    const searchResults = await search(`${artist} ${title}`);

    // Verify a match was found
    if (searchResults.hits.length === 0) {
        res.status(404).send('Unable to find lyrics');
        res.end();
        return;
    }

    const lyrics = await getLyrics(searchResults.hits[0].result.path);
    res.send(lyrics.trim());
    res.end();
});

export default router;

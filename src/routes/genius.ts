import express from "express";
import { getLyrics, search } from '../api/genius';

const router = express.Router();

router.get('/lyrics', async (req, res) => {
    // Verify a query has been provided
    if (!('q' in req.query)) {
        res.status(400).send('No query provided');
        return;
    }

    const searchResults = await search(req.query.q);

    // Verify a match was found
    if (searchResults.hits.length === 0) {
        res.status(404).send('Unable to find lyrics');
        return;
    }

    const lyrics = await getLyrics(searchResults.hits[0].result.path);
    res.send(lyrics);
});

export default router;

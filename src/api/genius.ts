import axios from 'axios';
import cheerio from 'cheerio';
import diacritics from 'diacritics';
import { ILyricsAndDetails } from '../dto';
import config from '../config';

interface ISearchHit {
    index: string;
    type: string;
    result: {
        annotation_count: number;
        api_path: string;
        full_title: string;
        header_image_thumbnail_url: string;
        header_image_url: string;
        id: string;
        lyrics_owner_id: string;
        lyrics_state: string;
        path: string;
        pyongs_count: string;
        song_art_image_thumbnail_url: string;
        song_art_image_url: string;
        stats: {
            unreviewed_annotations: number;
            concurrents: number;
            hot: boolean;
            pageviews: number;
        };
        title: string;
        title_with_featured: string;
        url: string;
        primary_artist: {
            api_path: string;
            header_image_url: string;
            id: string;
            image_url: string;
            is_meme_verified: string;
            is_verified: string;
            name: string;
            url: string;
            iq: string;
        };
    };
}

interface ISearchResponse {
    hits: ISearchHit[];
}

export function search(term: string): Promise<ISearchResponse> {
    const parameters = {
        access_token: config.genius.access_token,
        q: diacritics.remove(term),
    };
    return axios.get('https://api.genius.com/search?' + (new URLSearchParams(parameters)))
        .then(response => response.data.response)
        .catch(e => console.error(e.data));
}

export function getLyrics(geniusUrl: string): Promise<ILyricsAndDetails> {
    return axios.get(`https://genius.com${geniusUrl}`)
        .then(r => {
            const $ = cheerio.load(r.data); // Load in the page
            const title = $('h1.header_with_cover_art-primary_info-title').text();
            const artist = $('a.header_with_cover_art-primary_info-primary_artist').text();
            $('a', '.lyrics').each((index, element) => {
                const e = $(element);
                return e.replaceWith(e.html());
            }); // Replace out all links in the scope
            const lyrics = $($('.lyrics')[0]).text().trim(); // Get the lyrics as HTML
            return { artist, geniusUrl, lyrics, title };
        });
}

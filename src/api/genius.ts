import axios from "axios";
import cheerio from "cheerio";
import diacritics from "diacritics";
import { ILyricsAndDetails } from "../dto";
import config from "../config";

export interface Stats {
  unreviewed_annotations: number;
  hot: boolean;
  pageviews?: number;
}

export interface PrimaryArtist {
  api_path: string;
  header_image_url: string;
  id: number;
  image_url: string;
  is_meme_verified: boolean;
  is_verified: boolean;
  name: string;
  url: string;
}

export interface Result {
  annotation_count: number;
  api_path: string;
  full_title: string;
  header_image_thumbnail_url: string;
  header_image_url: string;
  id: number;
  lyrics_owner_id: number;
  lyrics_state: string;
  path: string;
  pyongs_count?: number;
  song_art_image_thumbnail_url: string;
  song_art_image_url: string;
  stats: Stats;
  title: string;
  title_with_featured: string;
  url: string;
  song_art_primary_color: string;
  song_art_secondary_color: string;
  song_art_text_color: string;
  primary_artist: PrimaryArtist;
}

export interface Hit {
  highlights: any[];
  index: string;
  type: string;
  result: Result;
}

export interface ISearchResponse {
  hits: Hit[];
}

export function search(term: string): Promise<ISearchResponse> {
  const parameters = {
    access_token: config.genius.access_token,
    q: diacritics.remove(term)
  };
  return axios
    .get("https://api.genius.com/search?" + new URLSearchParams(parameters))
    .then(response => response.data.response)
    .catch(e => console.error(e.data));
}

export function getLyrics(geniusUrl: string): Promise<ILyricsAndDetails> {
  const fullGeniusURL = `https://genius.com${geniusUrl}`;
  return axios.get(fullGeniusURL).then(r => {
    const html = r.data;
    const $ = cheerio.load(html); // Load in the page
    const title = getTitle($);
    const artist = getArtist($);
    const lyrics = getLyricContents($);
    return { artist, lyricsSourceReference: fullGeniusURL, lyrics, title };
  });
}

function getTitle($: CheerioStatic) {
  const attempt1 = $("h1.header_with_cover_art-primary_info-title").text();
  if (attempt1 !== "") {
    return attempt1;
  }

  const attempt2 = $("h1[class*=SongHeaderdesktop__]").text();
  if (attempt2 !== "") {
    return attempt2;
  }

  return "";
}

function getArtist($: CheerioStatic) {
  const attempt1 = $("a.header_with_cover_art-primary_info-primary_artist").text();
  if (attempt1 !== "") {
    return attempt1;
  }

  const attempt2 = $("a[class*=HeaderArtistAndTracklistdesktop__Artist-]").text();
  if (attempt2 !== "") {
    return attempt2;
  }

  return "";
}

function getLyricContents($: CheerioStatic) {
  $("a", ".lyrics").each((index, element) => {
    const e = $(element);
    return e.replaceWith(e.html());
  }); // Replace out all links in the scope
  const attempt1 = $($(".lyrics")[0]).text().trim();
  if (attempt1 !== "") {
    return attempt1;
  }

  $("div[class*=Lyrics__Root-]").children().find("br").replaceWith("\n");
  const attempt2 = $("div[class*=Lyrics__Container-]").text();
  if (attempt2 !== "") {
    return attempt2;
  }

  return "";
}

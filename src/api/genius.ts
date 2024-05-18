import axios from "axios";
import cheerio from "cheerio";
import diacritics from "diacritics";
import { IFoundLyrics } from "../dto";

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

export function searchGenius(term: string, geniusApiToken: string): Promise<ISearchResponse> {
  const parameters = {
    access_token: geniusApiToken,
    q: diacritics.remove(term)
  };
  return axios
    .get("https://api.genius.com/search?" + new URLSearchParams(parameters))
    .then(response => response.data.response)
    .catch(e => console.error(e.data));
}

const getGeniusPath = async (
  artists: string[],
  title: string,
  albumName: string,
  durationMs: number,
  geniusApiToken: string
) => {
  const search1 = await searchGenius(`${artists[0]} ${title}`, geniusApiToken);
  if (
    search1.hits.length > 0 &&
    search1.hits[0].result.primary_artist.name.indexOf(artists[0]) !== -1
  ) {
    return search1.hits[0].result.path;
  }

  const search2 = await searchGenius(`${artists.join(" & ")} ${title}`, geniusApiToken);
  const primaryArtistInSearch2 = artists.reduce(
    (acc, curr) =>
      acc ||
      (search2.hits.length > 0 && search2.hits[0].result.primary_artist.name.indexOf(curr) !== -1),
    false
  );
  if (search2.hits.length !== 0 && primaryArtistInSearch2) {
    return search2.hits[0].result.path;
  }

  if (search1.hits.length > 0) {
    return search1.hits[0].result.path;
  }

  return null;
};

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
    const elementHtml = e.html();
    if (elementHtml === null) throw new Error("Unexpected application state: elementHtml === null");
    return e.replaceWith(elementHtml);
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

export const getLyricsForPath = async (geniusPath: string): Promise<IFoundLyrics | null> => {
  const requestUrl = `https://genius.com${geniusPath}`;

  try {
    const response = await axios.get<string>(requestUrl, {
      validateStatus: status => status === 200 || status === 404
    });

    if (response.status === 404) {
      return null;
    }

    const html = response.data;
    const $ = cheerio.load(html); // Load in the page
    const title = getTitle($);
    const artist = getArtist($);
    const lyrics = getLyricContents($);

    if (lyrics === undefined) {
      return null;
    }

    return {
      artist,
      title,
      plainLyrics: lyrics,
      attribution: requestUrl,
      syncedLyrics: null
    } as IFoundLyrics;
  } catch (e) {
    // Anything non-200 or 404 is considered an error
    console.warn(`Failed to call '${requestUrl}'`);

    if (e instanceof Error && e.stack !== undefined) {
      console.warn(e.stack);
    }

    if (axios.isAxiosError(e)) {
      if (e.response !== undefined) {
        console.log(`Response: HTTP${e.response.status} ${e.response.statusText}`);
        console.log(`Response headers: ${JSON.stringify(e.response.headers)}`);
        console.log(`Response data: ${JSON.stringify(e.response.data)}`);
      } else {
        console.log("No response");
      }
    } else {
      console.warn(e);
    }

    return null;
  }
};

export const getLyrics = async (
  artists: string[],
  title: string,
  albumName: string,
  durationMs: number,
  geniusApiToken: string
) => {
  const geniusPath = await getGeniusPath(artists, title, albumName, durationMs, geniusApiToken);
  if (geniusPath === null) {
    return null;
  }

  const lyrics = await getLyricsForPath(geniusPath);
  return lyrics;
};

import { ISearchResponse, search } from "../api/genius";

// An ideal search hit has the artist as the primary artist
export const searchForMostProbableLyricsHit = async (
  artists: string[],
  title: string
): Promise<ISearchResponse> => {
  const search1 = await search(`${artists[0]} ${title}`);
  if (
    search1.hits.length !== 0 &&
    search1.hits[0].result.primary_artist.name.indexOf(artists[0]) !== -1
  ) {
    return search1;
  }

  const search2 = await search(`${artists.join(" & ")} ${title}`);
  const primaryArtistInSearch2 = artists.reduce(
    (acc, curr) => acc || search2.hits[0].result.primary_artist.name.indexOf(curr) !== -1,
    false
  );
  if (search2.hits.length !== 0 && primaryArtistInSearch2) {
    return search2;
  }

  return search1;
};

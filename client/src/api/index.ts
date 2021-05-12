import Config from "../config";
import { ITokenExpiryPair, ILyricsAndDetails } from "../../../src/dto";

export function geniusGetLyrics(
  artists: string[],
  title: string
): Promise<ILyricsAndDetails | null> {
  const parameters = new URLSearchParams();
  parameters.append("title", title);
  for (const artist of artists) {
    parameters.append("artists", artist);
  }

  return fetch(`${Config.api.root}/api/genius/lyrics?${parameters}`).then(r =>
    r.status === 200 ? r.json() : null
  );
}

export function spotifyGetCurrentToken(): Promise<ITokenExpiryPair | null> {
  return fetch(`${Config.api.root}/api/spotify/token`, {
    credentials: "include"
  }).then(r => {
    if (r.status === 200) {
      return r.json();
    } else {
      return null;
    }
  });
}

export function spotifyRefreshToken(): Promise<ITokenExpiryPair | null> {
  return fetch(`${Config.api.root}/api/spotify/refresh-token`, {
    credentials: "include"
  }).then(r => {
    if (r.status === 200) {
      return r.json();
    } else {
      return null;
    }
  });
}

export function deleteSession(): Promise<Response> {
  return fetch(`${Config.api.root}/api/session`, {
    credentials: "include",
    method: "DELETE"
  });
}

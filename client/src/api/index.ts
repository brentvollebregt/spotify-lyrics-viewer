import { IFoundLyrics, ITokenExpiryPair } from "../../../src/dto";
import Config from "../config";

export function getLyrics(
  artists: string[],
  title: string,
  albumName: string,
  duration: number
): Promise<IFoundLyrics | null> {
  const parameters = new URLSearchParams();
  parameters.append("title", title);
  for (const artist of artists) {
    parameters.append("artists", artist);
  }
  parameters.append("albumName", albumName);
  parameters.append("duration", duration.toString());

  return fetch(`${Config.api.root}/api/lyrics?${parameters}`).then(r =>
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

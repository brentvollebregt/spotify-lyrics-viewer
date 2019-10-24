import Config from '../config';
import { ITokenExpiryPair } from './dto';

export function geniusGetLyrics(query: string): Promise<string> {
    return fetch(`${Config.api.root}/api/genius/lyrics?${new URLSearchParams({ q: query })}`)
        .then(r => r.text());
}

export function spotifyGetCurrentToken(): Promise<ITokenExpiryPair | null> {
    return fetch(`${Config.api.root}/api/spotify/token`, {
        credentials: 'include'
    })
        .then(r => {
            if (r.status === 200) {
                return r.json();
            } else {
                return null;
            }
        });
}

export function deleteSession(): Promise<Response> {
    return fetch(`${Config.api.root}/api/session`, {
        credentials: 'include',
        method: 'DELETE'
    });
}

import Config from '../config';

export function geniusGetLyrics(query: string): Promise<string> {
    return fetch(`${Config.api.root}/api/genius/lyrics?${new URLSearchParams({ q: query })}`)
        .then(r => r.text());
}

export function deleteSession(): Promise<Response> {
    return fetch(`${Config.api.root}/api/session`, {
        credentials: 'include',
        method: 'DELETE'
    });
}

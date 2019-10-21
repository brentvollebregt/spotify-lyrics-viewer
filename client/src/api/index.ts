import Config from '../config';

export function getGeniusLyrics(query: string): Promise<string> {
    return fetch(`${Config.api.root}/api/genius/lyrics?${new URLSearchParams({ q: query })}`)
        .then(r => r.text());
}

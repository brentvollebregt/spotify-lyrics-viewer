import Config from '../config';

export function spotifyAuthentication(code: string): Promise<object> {
    return fetch(`${Config.api.root}/api/spotify/authenticate`, {
        body: JSON.stringify({ code }),
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST'
    })
        .then(r => r.json());
}

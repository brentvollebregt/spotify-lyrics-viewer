import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { Container, Spinner } from 'react-bootstrap';
import Welcome from './Welcome';
import { geniusGetLyrics } from '../../api';
import { IToken } from '../../models';

interface ILyricUriPair {
    content: string;
    spotifyId: string;
}

interface IProps {
    token: IToken | null;
    user: SpotifyApi.UserObjectPrivate | null;
}

const LyricsView: React.FunctionComponent<IProps> = (props: IProps) => {
    const { token, user } = props;

    const [currentlyPlaying, setCurrentlyPlaying] = useState<SpotifyApi.CurrentlyPlayingObject | null>(null);
    const [lyrics, setLyrics] = useState<ILyricUriPair | null>(null);

    useEffect(() => { // Initially get playing song
        if (token !== null) {
            const spotifyApi = new SpotifyWebApi();
            spotifyApi.setAccessToken(token.value);
            spotifyApi.getMyCurrentPlayingTrack()
                .then((currentlyPlayingObject: SpotifyApi.CurrentlyPlayingObject) => setCurrentlyPlaying(currentlyPlayingObject));
        } else {
            setCurrentlyPlaying(null);
        }
    }, [token]);

    useEffect(() => { // Get new lyrics when the current playing item changes
        if (currentlyPlaying === null || currentlyPlaying.item === null) {
            setLyrics(null);
        } else {
            if (lyrics === null || currentlyPlaying.item.id !== lyrics.spotifyId) {
                // Get lyrics
                geniusGetLyrics(`${currentlyPlaying.item.name} ${currentlyPlaying.item.artists[0].name}`)
                    .then(newLyrics => {
                        if (currentlyPlaying.item !== null) {
                            setLyrics({ content: newLyrics, spotifyId: currentlyPlaying.item.id });
                        }
                    });
            }
        }
    }, [currentlyPlaying]);

    if (user === null) {
        return <Welcome user={user} />;
    }

    return <Container className="my-3">
        <div style={{ display: 'grid', gridTemplateColumns: '130px 250px 1fr', maxWidth: 700, margin: 'auto', background: '#f3f3f3' }}>
            <div className="m-2">
                {(currentlyPlaying !== null && currentlyPlaying.item !== null) ? <>
                    <img src={currentlyPlaying.item.album.images[0].url} className="w-100" />
                </> : <>
                        <Spinner animation="border" />
                    </>}
            </div>
            <div className="ml-1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {currentlyPlaying !== null && currentlyPlaying.item !== null && <>
                    <p className="m-1">{currentlyPlaying.item.name}</p>
                    <p className="m-1">{currentlyPlaying.item.artists.map(a => a.name).join(', ')}</p>
                    <p className="m-1">{currentlyPlaying.item.album.name}</p>
                </>}
            </div>
            <div>

            </div>
        </div>
        <div className="text-center mt-4">
            {lyrics === null ? <>
                <Spinner animation="border" />
            </> : <>
                <div style={{ whiteSpace: 'pre-wrap' }}>{lyrics.content}</div>
            </>}
        </div>
    </Container>;
};

export default LyricsView;

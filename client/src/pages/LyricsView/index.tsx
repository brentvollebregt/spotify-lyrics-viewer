import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { Container, Spinner } from 'react-bootstrap';
import Welcome from './Welcome';
import { IToken } from '../../models';

interface IProps {
    token: IToken | null;
    user: SpotifyApi.UserObjectPrivate | null;
}

const LyricsView: React.FunctionComponent<IProps> = (props: IProps) => {
    const { token, user } = props;

    const [currentlyPlaying, setCurrentlyPlaying] = useState<SpotifyApi.CurrentlyPlayingObject | null>(null);

    useEffect(() => {
        if (token !== null) {
            const spotifyApi = new SpotifyWebApi();
            spotifyApi.setAccessToken(token.value);
            spotifyApi.getMyCurrentPlayingTrack()
                .then((currentlyPlayingObject: SpotifyApi.CurrentlyPlayingObject) => setCurrentlyPlaying(currentlyPlayingObject));
        } else {
            setCurrentlyPlaying(null);
        }
    }, [token]);

    if (user === null) {
        return <Welcome user={user} />;
    }

    return <Container className="mt-3">
        <div style={{ display: 'grid', gridTemplateColumns: '130px 250px 1fr', maxWidth: 800, margin: 'auto', background: '#f3f3f3' }}>
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
            <p>Lyrics</p>
            <p>Lyrics</p>
            <p>Lyrics</p>
            <p>Lyrics</p>
        </div>
    </Container>;
};

export default LyricsView;

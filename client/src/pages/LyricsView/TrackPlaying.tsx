import React from 'react';
import { Container, Spinner } from 'react-bootstrap';

interface IProps {
    currentlyPlaying: SpotifyApi.CurrentlyPlayingObject;
    lyrics?: string;
}

const TrackPlaying: React.FunctionComponent<IProps> = (props: IProps) => {
    const { currentlyPlaying, lyrics } = props;

    return <Container className="my-3">
        <div style={{ display: 'grid', gridTemplateColumns: '130px 250px 1fr', maxWidth: 700, margin: 'auto', background: '#f3f3f3' }}>
            <div className="m-2">
                {(currentlyPlaying.item) ? <>
                    <img src={currentlyPlaying.item.album.images[0].url} alt={`${currentlyPlaying.item.album.name} Album Art`} className="w-100" />
                </> : <>
                    <Spinner animation="border" />
                </>}
            </div>
            <div className="ml-1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {currentlyPlaying.item && <>
                    <p className="m-1">{currentlyPlaying.item.name}</p>
                    <p className="m-1">{currentlyPlaying.item.artists.map(a => a.name).join(', ')}</p>
                    <p className="m-1">{currentlyPlaying.item.album.name}</p>
                </>}
            </div>
            <div>

            </div>
        </div>
        <div className="text-center mt-4">
            {lyrics ? <>
                <div style={{ whiteSpace: 'pre-wrap' }}>{lyrics}</div>
            </> : <>
                <Spinner animation="border" />
            </>}
        </div>
    </Container>;
};

export default TrackPlaying;

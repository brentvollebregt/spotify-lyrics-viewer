import React from 'react';
import { Container } from 'react-bootstrap';
import PlayerStatus from './sharedComponents/PlayerStatus';
import LyricsDisplay from './sharedComponents/LyricsDisplay';

interface IProps {
    current: SpotifyApi.CurrentlyPlayingObject;
    lyrics?: string;
    token?: string;
}

const TrackPlaying: React.FunctionComponent<IProps> = (props: IProps) => {
    const { current, lyrics, token } = props;

    const albumArtUrl = current.item ? current.item.album.images[0].url : undefined;
    const title = current.item ? current.item.name : undefined;
    const artist = current.item ? current.item.artists.map(a => a.name).join(', ') : undefined;
    const album = current.item ? current.item.album.name : undefined;
    const durationMs = current.item !== null ? current.item.duration_ms : 0;
    const progressMs = current.progress_ms !== null ? current.progress_ms : 0;
    const isPlaying = current.is_playing;

    return <Container className="my-3">
        <PlayerStatus
            albumArtUrl={albumArtUrl}
            title={title}
            artist={artist}
            album={album}
            durationMs={durationMs}
            progressMs={progressMs}
            isPlaying={isPlaying}
            spotifyToken={token}
        />
        <div className="mt-3">
            <LyricsDisplay
                lyrics={lyrics}
            />
        </div>
    </Container>;
};

export default TrackPlaying;

import React from 'react';
import { Container } from 'react-bootstrap';
import SpotifyLoginStatusButton from '../../components/SpotifyLoginStatusButton';

interface IProps {
    user: SpotifyApi.UserObjectPrivate | null;
}

const Welcome: React.FunctionComponent<IProps> = (props: IProps) => {
    const { user } = props;

    return <Container className="text-center">
        <h2>Spotify Lyrics Online Viewer</h2>
        <p>To get access to your current playing song, you need to sign into Spotify.</p>
        <SpotifyLoginStatusButton user={user} />
    </Container>;
};

export default Welcome;

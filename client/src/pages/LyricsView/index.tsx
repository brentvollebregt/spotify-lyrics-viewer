import React from 'react';
import { Container } from 'react-bootstrap';
import Welcome from './Welcome';
import { IToken } from '../../models';

interface IProps {
    token: IToken | null;
    user: SpotifyApi.UserObjectPrivate | null;
}

const LyricsView: React.FunctionComponent<IProps> = (props: IProps) => {
    const { token, user } = props;

    if (user === null) {
        return <Welcome user={user} />;
    }

    return <Container>
        <h1>Lyrics View</h1>
    </Container>;
};

export default LyricsView;

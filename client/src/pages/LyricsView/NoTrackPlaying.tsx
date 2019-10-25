import React from 'react';
import { Container } from 'react-bootstrap';

const NoTrackPlaying: React.FunctionComponent = () => {
    return <Container className="text-center">
        <h2>No song playing</h2>
        <p>Play a song for lyrics to be displayed. (make sure a private session is not being used)</p>
    </Container>;
};

export default NoTrackPlaying;

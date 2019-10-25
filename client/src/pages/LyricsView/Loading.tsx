import React from 'react';
import { Container } from 'react-bootstrap';

const Loading: React.FunctionComponent = () => {
    return <Container className="text-center">
        <h2>Loading</h2>
        <p>Getting the currently playing song</p>
    </Container>;
};

export default Loading;

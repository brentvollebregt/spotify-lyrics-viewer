import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const About: React.FunctionComponent = () => {
    return <Container>
        <Row className="justify-content-md-center">
            <Col className="col-md-10 col-lg-8">
                <h2 className="text-center">About</h2>
                <p>Spotify Lyrics Viewer is a tool that allows you to view the lyrics of the current playing song on Spotify.</p>
                <p>To do this, we first log you into Spotify so we can see the current song playing. The title and artist are then used to try and find the lyrics on <a href="https://genius.com/">GENIUS</a> and whatever lyrics matched the best are displayed to you.</p>
                <p>Please note that the lyrics returned may not be for the current playing song in some situations due the the lyrics not existing on GENIUS or the fact that the current playing songs title has some extra content to it aside from the actual title.</p>
            </Col>
        </Row>
    </Container>;
};

export default About;

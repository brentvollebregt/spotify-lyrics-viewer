import React from 'react';
import { navigate } from 'hookrouter';
import { Container, Spinner } from 'react-bootstrap';
import Config from '../../config';

interface IProps {
    onNewToken: (accessToken: string, expiresIn: number) => void;
}

const SpotifyAuthorization: React.FunctionComponent<IProps> = (props: IProps) => {
    const { onNewToken } = props;
    const { search } = window.location;

    let message = <></>;

    if (search === '') { // No token in URL, redirect user to request for one
        window.location.href = Config.api.root + Config.api.spotify_authentication_route;
        message = <>
            <Spinner animation="border" />
            <p className="lead">Redirecting</p>
        </>;
    } else { // We have received the token, read it from the URL
        const params = new URLSearchParams(search.substr(1));
        const accessToken = params.get('access_token');
        const expiresIn = params.get('expires_in');

        if (accessToken !== null && expiresIn !== null) { // All parameters are present
            onNewToken(accessToken, parseInt(expiresIn, 10));
            navigate('/');
            message = <p className="lead">Token received</p>;
        } else {
            message = <p className="lead">Incorrect URL parameters</p>;
        }
    }

    return <Container className="text-center">
        <h1>Spotify Authorization</h1>
        {message}
    </Container>;
};

export default SpotifyAuthorization;

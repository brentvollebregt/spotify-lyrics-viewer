import React from 'react';
import { navigate } from 'hookrouter';
import { Container, Spinner } from 'react-bootstrap';
import { spotifyAuthentication } from '../../api';
import { randomString } from '../../utils';
import Config from '../../config';

// Based off https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow

const localStorageStateKey = 'spotify-auth-random-state';

interface IProps {}

const SpotifyAuthorization: React.FunctionComponent<IProps> = (props: IProps) => {
    const { search } = window.location;

    const onCodeReceived = (code: string) => {
        // TODO Request for token
        spotifyAuthentication(code)
            .then(console.log)
            .catch(console.error);
        navigate('/');
    };

    let message = <></>;

    if (search === '') { // No token in URL, redirect user to request for one
        // Setup random state
        const randomState = randomString(16);
        localStorage.setItem(localStorageStateKey, randomState);
        // Redirect
        const urlParameters = {
            client_id: Config.spotify.client_id,
            redirect_uri: window.location.href,
            response_type: 'code',
            scope: Config.spotify.permission_scope,
            show_dialog: false,
            state: randomState,
        };
        const urlParametersEncoded = new URLSearchParams(urlParameters as any);
        window.location.href = 'https://accounts.spotify.com/authorize?' + urlParametersEncoded;
        message = <>
            <Spinner animation="border" />
            <p className="lead">Requesting token, you will be redirected to Spotify</p>
        </>;

    } else { // We have received the token, read it from the URL
        const params = new URLSearchParams(search.substr(1));
        const code = params.get('code');
        const state = params.get('state');

        if (code !== null && state !== null) { // All parameters are present
            const storedRandomState = localStorage.getItem(localStorageStateKey);
            if (storedRandomState !== null && storedRandomState === state) { // Random state was set and matches
                localStorage.removeItem(localStorageStateKey);
                onCodeReceived(code);
                message = <>
                    <Spinner animation="border" />
                    <p className="lead">Authenticating</p>
                </>;

            } else { // Token received but it does not match the state stored (if there was one)
                message = <p className="lead">Token not requested by this application</p>;
            }
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

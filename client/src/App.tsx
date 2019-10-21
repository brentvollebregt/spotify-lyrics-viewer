import React, { useEffect, useState } from 'react';
import { useRoutes, useRedirect } from 'hookrouter';
import SpotifyWebApi from 'spotify-web-api-js';
import cogoToast from 'cogo-toast';
import Navigation from './components/Navigation';
import About from './pages/About';
import LyricsView from './pages/LyricsView';
import NotFound from './pages/NotFound';
import SpotifyAuthorization from './pages/SpotifyAuthorization';
import { IToken } from './models';

const App: React.FC = () => {
    const [token, setToken] = useState<IToken | null>(null);
    const [user, setUser] = useState<SpotifyApi.UserObjectPrivate | null>(null);

    useEffect(() => {  // Request the user when the token changes
        if (token === null) {
            setUser(null);
        } else {
            const spotifyApi = new SpotifyWebApi();
            spotifyApi.setAccessToken(token.value);
            spotifyApi.getMe()
                .then(newUser => setUser(newUser))
                .catch(err => cogoToast.error(
                    'Could not get your profile. Make sure you are connected to the internet and that your token is valid.',
                    { position: "bottom-center", heading: 'Error When Fetching Your Profile', hideAfter: 20, onClick: (hide: any) => hide() }
                ));
        }
    }, [token]);

    useEffect(() => {
        // TODO Prepare for expiry
    }, [token]);

    useEffect(() => {
        // TODO Request for token from server to see if one is already stored
    }, []);

    const onNewToken = (accessToken: string, expiresAt: number) => {
        setToken({ expiry: new Date(expiresAt), value: accessToken });
    };
    const clearToken = () => setToken(null); // TODO Delete token server side

    const routes = {
        '/': () => <LyricsView token={token} user={user} />,
        '/about': () => <About />,
        '/spotify-authorization': () => <SpotifyAuthorization onNewToken={onNewToken} />,
    };
    const routeResult = useRoutes(routes);
    useRedirect('/spotify-authorization/', '/spotify-authorization');

    return <>
        <Navigation user={user} onLogout={clearToken} />
        {routeResult || <NotFound />}
    </>;
};

export default App;

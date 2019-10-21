import React, { useState } from 'react';
import { useRoutes, useRedirect } from 'hookrouter';
import { IToken } from './models';
import Navigation from './components/Navigation';
import About from './pages/About';
import LyricsView from './pages/LyricsView';
import NotFound from './pages/NotFound';
import SpotifyAuthorization from './pages/SpotifyAuthorization';

const App: React.FC = () => {
  const [token, setToken] = useState<IToken | null>(null);

  const onNewToken = (accessToken: string, expiresAt: number) => {
    setToken({ expiry: new Date(expiresAt), value: accessToken });
    console.log({ expiry: new Date(expiresAt), value: accessToken });
  };

  const routes = {
    '/': () => <LyricsView />,
    '/about': () => <About />,
    '/spotify-authorization': () => <SpotifyAuthorization onNewToken={onNewToken} />,
  };
  const routeResult = useRoutes(routes);
  useRedirect('/spotify-authorization/', '/spotify-authorization');

  return <>
    <Navigation />
    {routeResult || <NotFound />}
  </>;
};

export default App;

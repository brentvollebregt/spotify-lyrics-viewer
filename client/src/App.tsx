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

  const onNewToken = (accessToken: string, expiresIn: number) => {
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + expiresIn);
    setToken({ expiry: expiryDate, value: accessToken });
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

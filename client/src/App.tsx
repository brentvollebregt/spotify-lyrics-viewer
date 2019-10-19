import React from 'react';
import { useRoutes, useRedirect } from 'hookrouter';
import Navigation from './components/Navigation';
import About from './pages/About';
import LyricsView from './pages/LyricsView';
import NotFound from './pages/NotFound';
import SpotifyAuthorization from './pages/SpotifyAuthorization';

const App: React.FC = () => {
  const routes = {
    '/': () => <LyricsView />,
    '/about': () => <About />,
    '/spotify-authorization': () => <SpotifyAuthorization />,
  };
  const routeResult = useRoutes(routes);
  useRedirect('/spotify-authorization/', '/spotify-authorization');

  return <>
    <Navigation />
    {routeResult || <NotFound />}
  </>;
};

export default App;

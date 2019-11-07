import React from 'react';
import { Container } from 'react-bootstrap';
import GithubLogo from '../img/github-logo.png';
import './Footer.css';

const Footer: React.FunctionComponent = () => {
  return <footer className="footer d-flex align-items-center">
    <Container className="text-center">
      <div className="d-inline-flex align-items-center">
        <a href="https://github.com/brentvollebregt/spotify-lyrics-viewer" className="d-flex align-items-center" style={{ padding: 5, cursor: 'pointer' }}>
          <img src={GithubLogo} height="25" alt="GitHub Source" />
          <span className="ml-2">Source</span>
        </a>
        <span className="ml-2">•</span>
        <span className="ml-2"><a href="https://github.com/brentvollebregt">Brent Vollebregt</a></span>
        <span className="ml-2">•</span>
        <span className="ml-2"><a href="https://nitratine.net/">Nitratine.net</a></span>
      </div>
    </Container>
  </footer>;
};

export default Footer;

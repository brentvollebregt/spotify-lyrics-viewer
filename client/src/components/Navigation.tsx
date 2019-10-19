import React from 'react';
import { navigate, usePath } from 'hookrouter';
import { Container, Nav, Navbar } from 'react-bootstrap';

const navbarLinks: { [key: string]: string } = {
    '/': 'Home',
    '/about': 'About',
};

interface IProps { }

const Navigation: React.FunctionComponent<IProps> = (props: IProps) => {
    const currentPath = usePath();

    const goTo = (location: string) => () => navigate(location);

    return <Navbar collapseOnSelect expand="md" bg="light" variant="light" sticky="top">
        <Container>
            <Navbar.Brand onClick={goTo('/')}>
                <img
                    src={'https://via.placeholder.com/320x60'}
                    height="30"
                    className="d-inline-block align-top"
                    alt="Emotionify Banner Logo"
                    style={{ cursor: 'pointer' }}
                />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    {Object.keys(navbarLinks).map(path =>
                        <Nav.Link key={path} href="#" onClick={goTo(path)} active={currentPath === path}>
                            {navbarLinks[path]}
                        </Nav.Link>
                    )}
                </Nav>
                <Nav>
                    <Nav.Link href="#" onClick={goTo('/spotify-authorization')}>Controls (TEMP)</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>;
};

export default Navigation;

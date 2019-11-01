import React, { useEffect, useRef, useState, RefObject } from 'react';
import MarkJS from 'mark.js';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { Button, InputGroup, FormControl, Spinner, FormControlProps } from 'react-bootstrap';
import { ReplaceProps, BsPrefixProps } from 'react-bootstrap/helpers';
import './LyricsDisplay.css';

const useStyles = makeStyles({
    lyrics: {
        fontSize: 18,
        lineHeight: '1.7em',
        whiteSpace: 'pre-wrap'
    },
    root: {
        margin: 'auto',
        maxWidth: 700,
        position: 'relative'
    },
    toggleSearchButton: {
        margin: '-6px -6px 0 0',
        position: 'absolute',
        right: 0,
        top: 0
    }
});

interface IProps {
    lyrics?: string;
}

const LyricsDisplay: React.FunctionComponent<IProps> = (props: IProps) => {
    const { lyrics } = props;

    const classes = useStyles();
    const lyricsRef = useRef<HTMLDivElement | null>(null);
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const [search, setSearch] = useState('');
    const [searchShown, setSearchShown] = useState(false);

    useEffect(() => { // Highlight text when the search is changed
        if (lyricsRef.current !== null) {
            const instance = new MarkJS(lyricsRef.current);
            instance.unmark();
            if (search !== '') {
                instance.mark(search);
            }
        }
    }, [search, lyrics]);

    useEffect(() => { // Focus search input when the search button is clicked
        if (searchShown && searchInputRef.current !== null) {
            searchInputRef.current.focus();
        }
    }, [searchShown]);

    const onUserSearch = (event: React.FormEvent<ReplaceProps<"input", BsPrefixProps<"input"> & FormControlProps>>) => setSearch(event.currentTarget.value === undefined ? '' : event.currentTarget.value);
    const toggleSearchShown = () => setSearchShown(s => !s);

    return <div className={`${classes.root} text-center`}>
        {searchShown
            ? <InputGroup className="mb-3">
                <FormControl ref={searchInputRef as RefObject<any>} onChange={onUserSearch} value={search} placeholder="Search lyrics you heard to find your position..." className="text-center" />
                <InputGroup.Append>
                    <Button variant="outline-secondary" onClick={toggleSearchShown}>Close</Button>
                </InputGroup.Append>
            </InputGroup>
            : <IconButton className={classes.toggleSearchButton} onClick={toggleSearchShown}>
                <Search fontSize="small" />
            </IconButton>
        }
        {lyrics
            ? <div className={classes.lyrics} ref={lyricsRef}>{lyrics}</div>
            : <Spinner animation="border" />
        }
    </div>;
};

export default LyricsDisplay;

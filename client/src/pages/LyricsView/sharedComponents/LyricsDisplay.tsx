import React, { useEffect, useRef, useState } from 'react';
import MarkJS from 'mark.js';
import { makeStyles } from '@material-ui/core/styles';
import { Spinner, Form, FormControlProps } from 'react-bootstrap';
import { ReplaceProps, BsPrefixProps } from 'react-bootstrap/helpers';
import './LyricsDisplay.css';

const useStyles = makeStyles({
    lyrics: {
        whiteSpace: 'pre-wrap'
    }
});

interface IProps {
    lyrics?: string;
}

const LyricsDisplay: React.FunctionComponent<IProps> = (props: IProps) => {
    const { lyrics } = props;

    const classes = useStyles();
    const lyricsRef = useRef<HTMLDivElement | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => { // Highlight text when the search is changed
        if (lyricsRef.current !== null) {
            const instance = new MarkJS(lyricsRef.current);
            instance.unmark();
            if (search !== '') {
                instance.mark(search);
            }
        }
    }, [search]);

    const onUserSearch = (event: React.FormEvent<ReplaceProps<"input", BsPrefixProps<"input"> & FormControlProps>>) => setSearch(event.currentTarget.value === undefined ? '' : event.currentTarget.value);

    return <div className="text-center">
        <div>
            <Form.Control onChange={onUserSearch} value={search} placeholder="Search lyrics you heard to find your position..." className="text-center" />
        </div>
        {lyrics
            ? <div className={classes.lyrics} ref={lyricsRef}>{lyrics}</div>
            : <Spinner animation="border" />
        }
    </div>;
};

export default LyricsDisplay;

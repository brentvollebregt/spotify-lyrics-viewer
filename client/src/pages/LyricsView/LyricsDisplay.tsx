import React, { useEffect, useRef, useState } from "react";
import MarkJS from "mark.js";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";

import "./LyricsDisplay.css";

const useStyles = makeStyles({
  lyrics: {
    fontSize: 18,
    lineHeight: "1.7em",
    whiteSpace: "pre-wrap"
  },
  root: {
    margin: "auto",
    maxWidth: 700,
    position: "relative",
    textAlign: "center"
  },
  toggleSearchButton: {
    margin: "-6px -6px 0 0",
    position: "absolute",
    right: 0,
    top: 0
  }
});

interface IProps {
  lyrics?: string;
  lyricsArtist?: string;
  lyricsTitle?: string;
  geniusUrl?: string;
}

const LyricsDisplay: React.FunctionComponent<IProps> = ({
  lyrics,
  lyricsArtist,
  lyricsTitle,
  geniusUrl
}) => {
  const classes = useStyles();
  const lyricsRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState("");
  const [searchShown, setSearchShown] = useState(false);

  useEffect(() => {
    // Highlight text when the search is changed
    if (lyricsRef.current !== null) {
      const instance = new MarkJS(lyricsRef.current);
      instance.unmark();
      if (search !== "") {
        instance.mark(search);
      }
    }
  }, [search, lyrics]);

  useEffect(() => {
    // Focus search input when the search button is clicked
    if (searchShown && searchInputRef.current !== null) {
      searchInputRef.current.focus();
    }
  }, [searchShown]);

  const onUserSearch = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
    setSearch(event.currentTarget.value === undefined ? "" : event.currentTarget.value);
  const toggleSearchShown = () => setSearchShown(s => !s);

  return (
    <div className={classes.root}>
      {/* TODO https://material-ui.com/components/text-fields/#input-adornments */}
      {searchShown ? (
        <Box mb={1}>
          <TextField
            variant="outlined"
            value={search}
            onChange={onUserSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleSearchShown} edge="end">
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            label="Search"
            placeholder="Search lyrics you heard to find your position..."
            style={{ width: "100%", maxWidth: 600 }}
          />
        </Box>
      ) : (
        <IconButton className={classes.toggleSearchButton} onClick={toggleSearchShown}>
          <SearchIcon fontSize="small" />
        </IconButton>
      )}
      {lyrics ? (
        <div>
          <div className={classes.lyrics} ref={lyricsRef}>
            {lyrics}
          </div>
          <Box mt={2} textAlign="left">
            <a href={`https://genius.com${geniusUrl}`} target="_blank">
              Lyrics for {lyricsTitle} by {lyricsArtist}
            </a>
          </Box>
        </div>
      ) : (
        <CircularProgress size={30} />
      )}
    </div>
  );
};

export default LyricsDisplay;

import React, { useEffect, useRef, useState } from "react";
import MarkJS from "mark.js";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  makeStyles,
  TextField,
  Typography
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";

import "./LyricsDisplay.css";

interface IProps {
  lyrics?: string;
  syncedLyricsArray?: Array<any>;
  lyricsArtist?: string;
  lyricsTitle?: string;
  geniusUrl?: string;
  progressMs?: number;
}

const LyricsDisplay: React.FunctionComponent<IProps> = ({
  syncedLyricsArray,
  lyrics,
  lyricsArtist,
  lyricsTitle,
  geniusUrl,
  progressMs
}) => {
  const clonedLyricsArray = syncedLyricsArray === undefined ? [] : [...syncedLyricsArray];
  const classes = useStyles();
  const lyricsRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState("");
  const [searchShown, setSearchShown] = useState(false);
  const [syncedLyrics, setSyncedLyrics] = useState({
    array: clonedLyricsArray,
    before: "",
    highlighted: "",
    after: lyrics
  });
  const [naturalSongProgress, setNaturalSongProgress] = useState(0);

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

  //accounting for rewinding the song
  useEffect(() => {
    if (progressMs === undefined) {
      return; // song switched
    }
    if (progressMs < naturalSongProgress) {
      const clonedLyricsArray = syncedLyricsArray === undefined ? [] : [...syncedLyricsArray];
      setNaturalSongProgress(0);
      setSyncedLyrics({ array: clonedLyricsArray, before: "", highlighted: "", after: lyrics });
    }
  }, [progressMs]);

  //making sure highlighted text is always visible
  useEffect(() => {
    const element = document.getElementById("highlighted-text");
    element?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  }, [syncedLyricsArray, progressMs]);

  useEffect(() => {
    const progressArray = syncedLyrics.array;
    if (syncedLyricsArray === undefined || progressArray === undefined) {
      //genius fallback was used and lfc was not provided
      return;
    }
    // let clonedSyncedLyricsArray = [...syncedLyricsArray];
    if (progressMs === undefined) {
      //switching songs
      return;
    }
    if (progressArray.length === 0) {
      //end of lyrics
      return;
    }
    const adjustProgress = progressMs + 135; // accounting for latency
    setNaturalSongProgress(adjustProgress);
    const progressInSeconds = adjustProgress / 1000;
    // while is used to account for scenarios where a song is fast forwarded
    // typically it would be just one interaction on the loop
    while (progressArray[0] && progressInSeconds >= progressArray[0].timestamp) {
      const currentLyric = progressArray.shift(); // acting as a queue
      console.log("currentLyric: " + currentLyric.content);
      setSyncedLyrics(prev => {
        const before = prev.before + " \n " + prev.highlighted;
        const highlighted = currentLyric.content;
        const after = progressArray.map(lfc => lfc.content).join(" \n ");
        const currObject = { array: progressArray, before, highlighted, after };
        return currObject;
      });
    }
  }, [syncedLyricsArray, progressMs]);

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
          <Typography component="div" className={classes.lyrics} ref={lyricsRef}>
            {syncedLyrics.before}
            <br />
            <span id="highlighted-text" className={classes.mark}>
              {syncedLyrics.highlighted}
            </span>
            <br />
            {syncedLyrics.after}
          </Typography>
          <Box mt={2} textAlign="left">
            <Typography>
              <Link href={`https://genius.com${geniusUrl}`}>
                Lyrics for {lyricsTitle} by {lyricsArtist}
              </Link>
            </Typography>
          </Box>
        </div>
      ) : (
        <CircularProgress size={30} />
      )}
    </div>
  );
};

const useStyles = makeStyles({
  lyrics: {
    whiteSpace: "pre-wrap"
  },
  mark: {
    background: "#03fccf",
    color: "white",
    padding: "0.1em 0",
    whiteSpace: "pre-wrap",
    fontWeight: "bolder"
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

export default LyricsDisplay;

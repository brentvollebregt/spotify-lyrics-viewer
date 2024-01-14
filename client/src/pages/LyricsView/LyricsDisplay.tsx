import React, { useEffect, useRef, useState } from "react";
import MarkJS from "mark.js";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  makeStyles,
  Toolbar,
  TextField,
  Typography
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";

import SyncEnabledIcon from "@material-ui/icons/Sync";
import SyncDisabledIcon from "@material-ui/icons/SyncDisabled";

import "./LyricsDisplay.css";
import { Sync } from "@material-ui/icons";

// adjusting for latency to highlight lyrics due to the time it takes to render the components on screen
const LATENCY_ADJUSTMENT_MAGIC_VALUE: number = 135;

interface ILRCContent {
  content: string;
  timestamp: number;
}

interface IProps {
  lyrics?: string;
  syncedLyricsArray?: Array<ILRCContent>;
  lyricsArtist?: string;
  lyricsTitle?: string;
  geniusUrl?: string;
  progressMs?: number;
}

const LyricsDisplay: React.FunctionComponent<IProps> = ({
  syncedLyricsArray,
  lyrics,
  progressMs
}) => {
  //cloning the original lyrics array sp that we can restore the lyrics if a user rewinds the song
  const clonedLyricsArray = syncedLyricsArray === undefined ? [] : [...syncedLyricsArray];
  const classes = useStyles();
  const lyricsRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const highlightedRef = useRef<HTMLSpanElement | null>(null);
  const [search, setSearch] = useState("");
  const [searchShown, setSearchShown] = useState(false);
  const [syncedLyrics, setSyncedLyrics] = useState({
    array: clonedLyricsArray,
    before: "",
    highlighted: "",
    after: lyrics
  });
  const [naturalSongProgress, setNaturalSongProgress] = useState(0);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [syncPossible] = useState(!!syncedLyricsArray);

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
    const element = highlightedRef.current;
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }
  }, [syncedLyricsArray, progressMs]);

  useEffect(() => {
    const progressArray = syncedLyrics.array;
    if (syncedLyricsArray === undefined || progressArray === undefined) {
      //genius fallback was used and lfc was not provided
      return;
    }
    if (progressMs === undefined) {
      //switching songs
      return;
    }
    if (progressArray.length === 0) {
      //end of lyrics
      return;
    }
    if (!syncEnabled) {
      //sync is disabled by the user
      return;
    }
    const adjustProgress = progressMs + LATENCY_ADJUSTMENT_MAGIC_VALUE; // accounting for latency
    setNaturalSongProgress(adjustProgress);
    const progressInSeconds = adjustProgress / 1000;
    // while is used to account for scenarios where a song is fast forwarded
    // typically it would be just one interaction on the loop
    while (progressArray[0] && progressInSeconds >= progressArray[0].timestamp) {
      const currentLyric = progressArray.shift() as ILRCContent; // acting as a queue
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
  const toggleSyncEnabled = () => {
    setSyncEnabled(s => !s);
  };

  return (
    <div className={classes.root}>
      <Toolbar className={classes.toolbar}>
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
          <IconButton onClick={toggleSearchShown}>
            <SearchIcon fontSize="small" />
          </IconButton>
        )}
        {syncPossible ? (
          <IconButton onClick={toggleSyncEnabled}>
            {syncEnabled ? <SyncEnabledIcon /> : <SyncDisabledIcon />}
          </IconButton>
        ) : (
          <SyncDisabledIcon />
        )}
      </Toolbar>
      {lyrics ? (
        <div>
          <Typography component="div" className={classes.lyrics} ref={lyricsRef}>
            {syncedLyrics.before}
            <br />
            <span id="highlighted-text" className={classes.mark} ref={highlightedRef}>
              {syncedLyrics.highlighted}
            </span>
            <br />
            {syncedLyrics.after}
          </Typography>
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
    padding: "0.1em 0",
    whiteSpace: "pre-wrap",
    fontWeight: "bolder",
    fontSize: "5em"
  },
  root: {
    margin: "auto",
    maxWidth: 700,
    position: "relative",
    textAlign: "center"
  },
  toolbar: {
    padding: 0,
    margin: "-6px -6px 0 0",
    position: "fixed",
    right: "60px",
    top: "60px"
  }
});

export default LyricsDisplay;

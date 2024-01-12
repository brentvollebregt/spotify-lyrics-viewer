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
}

const LyricsDisplay: React.FunctionComponent<IProps> = ({
  syncedLyricsArray,
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
  const [syncedLyrics, setSyncedLyrics] = useState({ before: "", highlighted: "", after: lyrics });
  // const [lyricsBeforeHighlight,setLyricsBeforeHighlight] = useState("")
  // const [highlightedLyrics,setHighlightedLyrics] = useState("")
  // const [lyricsAfterHighlight,setLyricsAfterHighlight] = useState(lyrics)

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

  //making sure highlighted text is always visible
  useEffect(() => {
    const element = document.getElementById("highlighted-text");
    element?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  }, []);

  let elapsedTime = 3.5; //fix this magic number using spotify apis to sync progress eventually
  let arrayPosition = 0;

  useEffect(() => {
    if (syncedLyricsArray === undefined) {
      //genius fallback was used and lfc was provided
      return;
    }
    let clonedSyncedLyricsArray = [...syncedLyricsArray];
    const interval = setInterval(() => {
      if (clonedSyncedLyricsArray.length === 0) {
        //end of lyrics
        return;
      }
      if (elapsedTime >= clonedSyncedLyricsArray[0].timestamp) {
        const currentLyric = clonedSyncedLyricsArray.shift(); // acting as a queue
        console.log("currentLyric: " + currentLyric.content);
        setSyncedLyrics(prev => {
          const before = prev.before + " \n " + prev.highlighted;
          const highlighted = currentLyric.content;
          const after = clonedSyncedLyricsArray.map(lfc => lfc.content).join(" \n ");
          const currObject = { before, highlighted, after };
          return currObject;
        });
      }
      elapsedTime++;
    }, 1000); // 1000 milliseconds = 1 second

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [syncedLyricsArray]);

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

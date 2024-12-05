import {
  Box,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Toolbar,
  Typography,
  makeStyles
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import SyncEnabledIcon from "@material-ui/icons/Sync";
import SyncDisabledIcon from "@material-ui/icons/SyncDisabled";
import MarkJS from "mark.js";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { IFoundLyrics } from "../../../../src/dto";
import useSmoothProgress from "../../hooks/useSmoothProgress";
import "./LyricsDisplay.css";

interface IProps {
  lyricsDetails: IFoundLyrics;
  progressMs: number;
  paused: boolean;
}

const LyricsDisplay: React.FunctionComponent<IProps> = ({ lyricsDetails, progressMs, paused }) => {
  const classes = useStyles();
  const lyricsRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const highlightedRef = useRef<HTMLSpanElement | null>(null);
  const [search, setSearch] = useState("");
  const [searchShown, setSearchShown] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(true);

  const { progress: smoothedProgressMs } = useSmoothProgress(
    progressMs,
    Infinity,
    !paused,
    null,
    250
  );

  const isSyncingPossible = lyricsDetails.syncedLyrics !== null;

  // Highlight text when the search is changed
  useEffect(() => {
    if (lyricsRef.current !== null) {
      const instance = new MarkJS(lyricsRef.current);
      instance.unmark();
      if (search !== "") {
        instance.mark(search);
      }
    }
  }, [search, lyricsDetails]);

  // Focus search input when the search button is clicked
  useEffect(() => {
    if (searchShown && searchInputRef.current !== null) {
      searchInputRef.current.focus();
    }
  }, [searchShown]);

  // Automatically scroll to highlighted text
  useEffect(() => {
    const element = highlightedRef.current;
    if (syncEnabled && element !== null) {
      element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }
  }, [syncEnabled, smoothedProgressMs]);

  const lyricsState = useMemo(
    () => calculateLyricsState(lyricsDetails, smoothedProgressMs, syncEnabled, paused),
    [lyricsDetails, smoothedProgressMs, syncEnabled, paused]
  );

  const onUserSearch = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
    setSearch(event.currentTarget.value ?? "");
  const toggleSearchShown = () => setSearchShown(s => !s);
  const toggleSyncEnabled = () => setSyncEnabled(s => !s);

  return (
    <div className={classes.root}>
      <Toolbar className={classes.toolbar}>
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
        <IconButton onClick={toggleSyncEnabled} disabled={!isSyncingPossible}>
          {syncEnabled ? <SyncEnabledIcon /> : <SyncDisabledIcon />}
        </IconButton>
      </Toolbar>
      <div>
        <Typography component="div" className={classes.lyrics} ref={lyricsRef} id="lyrics-main">
          <span id="lyrics-passed">{lyricsState.before}</span>

          {lyricsState.highlighted !== "" && (
            <div className={classes.highlightedLyricsWrapper}>
              <span className={classes.highlightedLyrics} ref={highlightedRef} id="lyrics-current">
                {lyricsState.highlighted}
              </span>
            </div>
          )}

          <span id="lyrics-upcoming">{lyricsState.after}</span>
        </Typography>
        <Box mt={2} textAlign="left">
          <Typography id="lyrics-provider">
            <Link href={lyricsDetails.attribution}>
              Lyrics for {lyricsDetails.title} by {lyricsDetails.artist}
            </Link>
          </Typography>
        </Box>
      </div>
    </div>
  );
};

const calculateLyricsState = (
  lyricsDetails: IFoundLyrics,
  progressMs: number,
  syncEnabled: boolean,
  paused: boolean
) => {
  const progressSeconds = progressMs / 1000;

  // If there is no syncedLyricsArray or sync is disabled or the song is paused, return the plain lyrics
  if (lyricsDetails.syncedLyrics === null || !syncEnabled || paused) {
    return {
      before: "",
      highlighted: "",
      after: lyricsDetails.plainLyrics ?? ""
    };
  }

  // Calculate the current lyric state based on progress
  const passedLyricsAndCurrent =
    lyricsDetails.syncedLyrics.filter(x => x.timestamp <= progressSeconds) ?? [];
  const passedLyrics = passedLyricsAndCurrent.slice(0, -1);
  const currentLyrics =
    passedLyricsAndCurrent.length > 0
      ? passedLyricsAndCurrent[passedLyricsAndCurrent.length - 1]
      : null;
  const upcomingLyrics = lyricsDetails.syncedLyrics.filter(x => x.timestamp > progressSeconds);

  return {
    before: passedLyrics.map(x => x.content).join(" \n "),
    highlighted: currentLyrics?.content ?? "",
    after: upcomingLyrics.map(x => x.content).join(" \n ")
  };
};

const useStyles = makeStyles(theme => ({
  lyrics: {
    whiteSpace: "pre-wrap"
  },
  highlightedLyricsWrapper: {
    marginTop: 20,
    marginBottom: 20
  },
  highlightedLyrics: {
    padding: "0.1em 0",
    whiteSpace: "pre-wrap",
    fontWeight: "bolder",
    fontSize: "5em",
    [theme.breakpoints.down("xs")]: {
      fontSize: "3em"
    }
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
    right: 60,
    top: 75
  }
}));

export default LyricsDisplay;

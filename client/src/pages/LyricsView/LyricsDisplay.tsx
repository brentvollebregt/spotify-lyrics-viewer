import {
  Box,
  CircularProgress,
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
import React, { useEffect, useRef, useState } from "react";
import { ILRCContent } from "../../types/trackLyrics";
import "./LyricsDisplay.css";

// adjusting for latency to highlight lyrics due to the time it takes to render the components on screen
const LATENCY_ADJUSTMENT_MAGIC_VALUE_MS = 0.135;

interface IProps {
  lyrics?: string;
  syncedLyricsArray?: Array<ILRCContent>;
  lyricsArtist?: string;
  lyricsTitle?: string;
  lyricsSourceReference?: string;
  progressMs: number;
  paused: boolean;
}

const LyricsDisplay: React.FunctionComponent<IProps> = ({
  syncedLyricsArray,
  lyrics,
  lyricsSourceReference,
  lyricsArtist,
  lyricsTitle,
  progressMs,
  paused
}) => {
  const classes = useStyles();
  const lyricsRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const highlightedRef = useRef<HTMLSpanElement | null>(null);
  const [search, setSearch] = useState("");
  const [searchShown, setSearchShown] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(true);

  const isSyncingPossible = syncedLyricsArray !== undefined && syncedLyricsArray.length > 0;

  // Highlight text when the search is changed
  useEffect(() => {
    if (lyricsRef.current !== null) {
      const instance = new MarkJS(lyricsRef.current);
      instance.unmark();
      if (search !== "") {
        instance.mark(search);
      }
    }
  }, [search, lyrics]);

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
  }, [syncEnabled, progressMs]);

  const lyricsState = calculateLyricsState(
    lyrics,
    syncedLyricsArray,
    progressMs,
    syncEnabled,
    paused
  );

  const onUserSearch = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
    setSearch(event.currentTarget.value ?? "");
  const toggleSearchShown = () => setSearchShown(s => !s);
  const toggleSyncEnabled = () => setSyncEnabled(s => !s);

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
        <IconButton onClick={toggleSyncEnabled} disabled={!isSyncingPossible}>
          {syncEnabled ? <SyncEnabledIcon /> : <SyncDisabledIcon />}
        </IconButton>
      </Toolbar>
      {lyrics ? (
        <div>
          <Typography component="div" className={classes.lyrics} ref={lyricsRef}>
            {lyricsState.before}

            {lyricsState.highlighted !== "" && (
              <div>
                <br />
                <span className={classes.mark} ref={highlightedRef}>
                  {lyricsState.highlighted}
                </span>
                <br />
              </div>
            )}

            {lyricsState.after}
          </Typography>
          <Box mt={2} textAlign="left">
            <Typography>
              <Link href={lyricsSourceReference}>
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

const calculateLyricsState = (
  plainLyrics: string | undefined,
  syncedLyricsArray: Array<ILRCContent> | undefined,
  progressMs: number,
  syncEnabled: boolean,
  paused: boolean
) => {
  const progressSeconds = progressMs / 1000;
  const artificialProgressSeconds = progressSeconds + LATENCY_ADJUSTMENT_MAGIC_VALUE_MS / 1000;

  // If there is no syncedLyricsArray or sync is disabled, return the plain lyrics
  if (syncedLyricsArray === undefined || syncedLyricsArray.length === 0 || !syncEnabled || paused) {
    return {
      before: "",
      highlighted: "",
      after: plainLyrics ?? ""
    };
  }

  // Calculate the current lyric state based on progress
  const passedLyricsAndCurrent =
    syncedLyricsArray?.filter(x => x.timestamp <= artificialProgressSeconds) ?? [];
  const passedLyrics = passedLyricsAndCurrent.slice(0, -1);
  const currentLyrics =
    passedLyricsAndCurrent.length > 0
      ? passedLyricsAndCurrent[passedLyricsAndCurrent.length - 1]
      : null;
  const upcomingLyrics = syncedLyricsArray?.filter(x => x.timestamp > artificialProgressSeconds);

  return {
    before: passedLyrics.map(x => x.content).join(" \n "),
    highlighted: currentLyrics?.content ?? "",
    after: upcomingLyrics.map(x => x.content).join(" \n ")
  };
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
    top: 75
  }
});

export default LyricsDisplay;

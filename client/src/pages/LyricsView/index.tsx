import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Advertisement from './Advertisement';
import Error from './Error';
import Loading from './Loading';
import NoTrackPlaying from './NoTrackPlaying';
import TrackPlaying from './TrackPlaying';
import Welcome from './Welcome';
import { geniusGetLyrics } from '../../api';
import { IToken } from '../../models';

const periodicTrackCheckDelayMs = 5000;

interface ILyricUriPair {
    content: string;
    spotifyId: string;
}

interface IProps {
    token: IToken | null;
    user: SpotifyApi.UserObjectPrivate | null;
}

const LyricsView: React.FunctionComponent<IProps> = (props: IProps) => {
    const { token, user } = props;

    const [currentlyPlaying, setCurrentlyPlaying] = useState<SpotifyApi.CurrentlyPlayingObject | "NotPlaying" | "Advertisement" | "Loading" | "Error">("Loading");
    const [lyrics, setLyrics] = useState<ILyricUriPair | undefined>(undefined);
    const [checkSongTimeout, setCheckSongTimeout] = useState<NodeJS.Timeout | null>(null);

    const updateCurrentPlaying = (tokenValue: string) => {
        const spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(tokenValue);
        spotifyApi.getMyCurrentPlayingTrack()
            .then((currentlyPlayingObject: SpotifyApi.CurrentlyPlayingObject | "") => {
                if (currentlyPlayingObject === "") {
                    setCurrentlyPlaying("NotPlaying"); // HTTP 204 when no track is currently playing
                } else if (currentlyPlayingObject.currently_playing_type === "ad") {
                    setCurrentlyPlaying("Advertisement"); // Handle ads where no lyrics are associated
                } else {
                    setCurrentlyPlaying(currentlyPlayingObject);
                }
            })
            .catch(e => setCurrentlyPlaying("Error"));
    };

    useEffect(() => { // Get currently playing song on load (when the token changes)
        if (token !== null) {
            updateCurrentPlaying(token.value);
        } else {
            setCurrentlyPlaying("Loading");
        }
    }, [token]);

    useEffect(() => { // Setup a check for a new song at the end of the current song
        if (checkSongTimeout !== null) {
            clearTimeout(checkSongTimeout);
        }

        if (currentlyPlaying !== "NotPlaying" && currentlyPlaying !== "Advertisement" && currentlyPlaying !== "Loading" && currentlyPlaying !== "Error" && currentlyPlaying.item) {
            const timeToRefresh = currentlyPlaying.item.duration_ms - (currentlyPlaying.progress_ms === null ? 0 : currentlyPlaying.progress_ms) + 500; // (duration - progress) - 500ms
            setCheckSongTimeout(setTimeout(() => {
                if (token !== null) {
                    updateCurrentPlaying(token.value);
                }
            }, timeToRefresh));
        }

        return () => {
            if (checkSongTimeout !== null) {
                clearTimeout(checkSongTimeout);
            }
        };
    }, [currentlyPlaying]);

    useEffect(() => { // Setup timers to periodically check for a new song (in case someone skips)
        const intervalCheck = setInterval(() => {
            if (token !== null) {
                updateCurrentPlaying(token.value);
            }
        }, periodicTrackCheckDelayMs);

        return () => clearTimeout(intervalCheck);
    }, [token]);

    useEffect(() => { // Get new lyrics when the current playing item changes
        if (currentlyPlaying === "NotPlaying" || currentlyPlaying === "Advertisement" || currentlyPlaying === "Loading" || currentlyPlaying === "Error" || !currentlyPlaying.item) {
            setLyrics(undefined);
        } else {
            if (lyrics === undefined || currentlyPlaying.item.id !== lyrics.spotifyId) {
                // Get lyrics
                geniusGetLyrics(currentlyPlaying.item.artists[0].name, currentlyPlaying.item.name)
                    .then(newLyrics => {
                        if (currentlyPlaying.item !== null) {
                            setLyrics({ content: newLyrics, spotifyId: currentlyPlaying.item.id });
                        }
                    });
            }
        }
    }, [currentlyPlaying]);

    if (user === null) {
        return <Welcome user={user} />;
    } else if (currentlyPlaying === "Loading") {
        return <Loading />;
    } else if (currentlyPlaying === "NotPlaying") {
        return <NoTrackPlaying />;
    } else if (currentlyPlaying === "Advertisement") {
        return <Advertisement />;
    } else if (currentlyPlaying === "Error") {
        return <Error />;
    } else {
        return <TrackPlaying
            currentlyPlaying={currentlyPlaying}
            lyrics={lyrics !== undefined ? lyrics.content : undefined}
            token={token === null ? undefined : token.value}
        />;
    }
};

export default LyricsView;

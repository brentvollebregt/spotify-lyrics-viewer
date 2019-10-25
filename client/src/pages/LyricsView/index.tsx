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

    useEffect(() => { // Initially get playing song
        if (token !== null) {
            const spotifyApi = new SpotifyWebApi();
            spotifyApi.setAccessToken(token.value);
            spotifyApi.getMyCurrentPlayingTrack()
                .then((currentlyPlayingObject: SpotifyApi.CurrentlyPlayingObject | "") => {
                    if (currentlyPlayingObject === "") {
                        setCurrentlyPlaying("NotPlaying"); // HTTP 204 when no track is currently playing
                    } else if ((currentlyPlayingObject as any).currently_playing_type === "ad") {
                        setCurrentlyPlaying("Advertisement"); // Handle ads where no lyrics are associated
                    } else {
                        setCurrentlyPlaying(currentlyPlayingObject);
                    }
                })
                .catch(e => setCurrentlyPlaying("Error"));
        } else {
            setCurrentlyPlaying("Loading");
        }
    }, [token]);

    useEffect(() => { // Get new lyrics when the current playing item changes
        if (currentlyPlaying === "NotPlaying" || currentlyPlaying === "Advertisement" || currentlyPlaying === "Loading" || currentlyPlaying === "Error" || !currentlyPlaying.item) {
            setLyrics(undefined);
        } else {
            if (lyrics === undefined || currentlyPlaying.item.id !== lyrics.spotifyId) {
                // Get lyrics
                geniusGetLyrics(`${currentlyPlaying.item.name} ${currentlyPlaying.item.artists[0].name}`)
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
        return <TrackPlaying currentlyPlaying={currentlyPlaying} lyrics={lyrics !== undefined ? lyrics.content : undefined} />;
    }
};

export default LyricsView;

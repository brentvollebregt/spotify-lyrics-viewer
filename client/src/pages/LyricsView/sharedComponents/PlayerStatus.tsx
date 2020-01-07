import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import cogoToast from 'cogo-toast';
import { Spinner } from 'react-bootstrap';
import { withStyles } from '@material-ui/core/styles';
import { Slider, IconButton } from '@material-ui/core';
import { PlayArrow, Pause, SkipPrevious, SkipNext } from '@material-ui/icons';

const ProgressSlider = withStyles({
    rail: {
        borderRadius: 4,
        height: 8,
    },
    root: {
        color: '#52af77',
        height: 8,
    },
    thumb: {
        '&:focus,&:hover,&$active': {
            boxShadow: 'inherit',
        },
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        height: 20,
        marginLeft: -12,
        marginTop: -6,
        width: 20,
    },
    track: {
        borderRadius: 4,
        height: 8,
    }
})(Slider);

const responseError = (title: string, request: XMLHttpRequest) => {
    const { hide } = cogoToast.error(
        JSON.parse(request.responseText).error.message,
        { position: "bottom-center", heading: title, hideAfter: 20, onClick: () => hide() }
    );
};

interface IProps {
    albumArtUrl?: string;
    title?: string;
    artist?: string;
    album?: string;
    durationMs?: number;
    progressMs: number;
    isPlaying: boolean;
    spotifyToken?: string;
}

const PlayerStatus: React.FunctionComponent<IProps> = (props: IProps) => {
    const { albumArtUrl, title, artist, album, durationMs, progressMs, isPlaying, spotifyToken } = props;

    const [progress, setProgress] = useState(0);
    const [userSlidingProgress, setUserSlidingProgress] = useState(false);
    const [smoothProgressTimer, setSmoothProgressTimer] = useState<NodeJS.Timeout | null>(null);

    const duration = durationMs === undefined ? 0 : durationMs;

    useEffect(() => { // Use the current progress when the user is not sliding
        if (!userSlidingProgress) {
            setProgress(progressMs);
        }
    }, [userSlidingProgress, progressMs]);

    useEffect(() => { // Smoother progress bar
        if (smoothProgressTimer !== null) {
            clearTimeout(smoothProgressTimer);
        }

        const smoothingDelay = 500;
        setSmoothProgressTimer(setInterval(() => {
            if (!userSlidingProgress && isPlaying) {
                setProgress(value => Math.min(value + smoothingDelay, duration));
            }
        }, smoothingDelay));

        return () => {
            if (smoothProgressTimer !== null) {
                clearTimeout(smoothProgressTimer);
            }
        };

    }, [userSlidingProgress, isPlaying]);

    const onUserStartSliding = () => setUserSlidingProgress(true);
    const onUserFinishedSliding = () => {
        setUserSlidingProgress(false);
        if (spotifyToken) {
            const spotifyApi = new SpotifyWebApi();
            spotifyApi.setAccessToken(spotifyToken);
            spotifyApi.seek(progress)
                .catch(e => responseError('Failed to Seek', e));
        }
    };
    const onUserSlide = (event: React.ChangeEvent<{}>, value: number | number[]) => setProgress(Array.isArray(value) ? value[0] : value);

    const onSkipPrevious = () => {
        if (spotifyToken) {
            const spotifyApi = new SpotifyWebApi();
            spotifyApi.setAccessToken(spotifyToken);
            spotifyApi.skipToPrevious()
                .catch(e => responseError('Failed to Skip to Previous Song', e));
        }
    };
    const onSkipNext = () => {
        if (spotifyToken) {
            const spotifyApi = new SpotifyWebApi();
            spotifyApi.setAccessToken(spotifyToken);
            spotifyApi.skipToNext()
                .catch(e => {
                    responseError('Failed to Skip to Next Song', e);
                });
        }
    };
    const onPlayPauseToggle = () => {
        if (spotifyToken) {
            const spotifyApi = new SpotifyWebApi();
            spotifyApi.setAccessToken(spotifyToken);
            if (isPlaying) {
                spotifyApi.pause()
                    .catch(e => responseError('Failed to Pause', e));
            } else {
                spotifyApi.play()
                    .catch(e => responseError('Failed to Play', e));
            }
        }
    };

    return <div style={{ display: 'grid', gridTemplateColumns: '130px 230px 1fr', maxWidth: 700, margin: 'auto', background: '#f3f3f3' }}>
        <div className="m-1">
            {albumArtUrl
                ? <img src={albumArtUrl} alt={`${album} Album Art`} className="w-100" />
                : <div className="d-flex justify-content-center align-items-center h-100">
                    <Spinner animation="border" />
                </div>
            }
        </div>

        <div className="ml-1 d-flex flex-column justify-content-center">
            <p className="m-1">{title}</p>
            <p className="m-1">{artist}</p>
            <p className="m-1">{album}</p>
        </div>

        <div className="p-3 align-self-center">
            <div>
                <div className="text-center">
                    <IconButton onClick={onSkipPrevious} className="p-2">
                        <SkipPrevious fontSize="large" />
                    </IconButton>
                    <IconButton onClick={onPlayPauseToggle} className="p-2">
                        {isPlaying
                            ? <PlayArrow fontSize="large" />
                            : <Pause fontSize="large" />
                        }
                    </IconButton>
                    <IconButton onClick={onSkipNext} className="p-2">
                        <SkipNext fontSize="large" />
                    </IconButton>
                </div>
                <ProgressSlider
                    valueLabelDisplay="off"
                    value={progress}
                    min={0}
                    max={duration}
                    onMouseDown={onUserStartSliding}
                    onMouseUp={onUserFinishedSliding}
                    onChange={onUserSlide}
                    className="py-1"
                />
            </div>
        </div>
    </div>;
};

export default PlayerStatus;

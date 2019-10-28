import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import cogoToast from 'cogo-toast';
import { Container, Spinner } from 'react-bootstrap';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import SkipPrevious from '@material-ui/icons/SkipPrevious';
import SkipNext from '@material-ui/icons/SkipNext';

const ProgressSlider = withStyles({
    active: {},
    rail: {
        borderRadius: 4,
        height: 8,
    },
    root: {
        color: '#52af77',
        height: 8,
    },
    thumb: {
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        height: 20,
        marginTop: -6,
        marginLeft: -12,
        width: 20,
        '&:focus,&:hover,&$active': {
            boxShadow: 'inherit',
        },
    },
    track: {
        borderRadius: 4,
        height: 8,
    }
})(Slider);

const responseError = (title: string, request: XMLHttpRequest) => cogoToast.error(
    JSON.parse(request.responseText).error.message,
    { position: "bottom-center", heading: title, hideAfter: 20, onClick: (hide: any) => hide() }
);

interface IProps {
    current: SpotifyApi.CurrentlyPlayingObject;
    lyrics?: string;
    token?: string;
}

const TrackPlaying: React.FunctionComponent<IProps> = (props: IProps) => {
    const { current, lyrics, token } = props;

    const [progress, setProgress] = useState(0);
    const [userSlidingProgress, setUserSlidingProgress] = useState(false);
    const [smoothProgressTimer, setSmoothProgressTimer] = useState<NodeJS.Timeout | null>(null);

    const currentSongDuration = current.item === null ? 0 : current.item.duration_ms;

    useEffect(() => { // Use the current progress when the user is not sliding
        if (!userSlidingProgress && current.progress_ms !== null) {
            setProgress(current.progress_ms);
        }
    }, [userSlidingProgress, current.progress_ms]);

    useEffect(() => { // Smoother progress bar
        if (smoothProgressTimer !== null) {
            clearTimeout(smoothProgressTimer);
        }

        const smoothingDelay = 500;
        setSmoothProgressTimer(setInterval(() => {
            if (!userSlidingProgress && current.is_playing) {
                setProgress(value => Math.min(value + smoothingDelay, currentSongDuration));
            }
        }, smoothingDelay));

        return () => {
            if (smoothProgressTimer !== null) {
                clearTimeout(smoothProgressTimer);
            }
        };

    }, [userSlidingProgress, current.is_playing]);

    const onUserStartSliding = () => {
        setUserSlidingProgress(true);
    };
    const onUserFinishedSliding = () => {
        setUserSlidingProgress(false);
        if (token) {
            const spotifyApi = new SpotifyWebApi();
            spotifyApi.setAccessToken(token);
            spotifyApi.seek(progress)
                .catch(e => responseError('Failed to Seek', e));
        }
    };
    const onUserSlide = (event: React.ChangeEvent<{}>, value: number | number[]) => setProgress(Array.isArray(value) ? value[0] : value);

    const onSkipPrevious = () => {
        if (token) {
            const spotifyApi = new SpotifyWebApi();
            spotifyApi.setAccessToken(token);
            spotifyApi.skipToPrevious()
                .catch(e => responseError('Failed to Skip to Previous Song', e));
        }
    };
    const onSkipNext = () => {
        if (token) {
            const spotifyApi = new SpotifyWebApi();
            spotifyApi.setAccessToken(token);
            spotifyApi.skipToNext()
                .catch(e => {
                    responseError('Failed to Skip to Next Song', e);
                });
        }
    };
    const onPlayPauseToggle = () => {
        if (token) {
            const spotifyApi = new SpotifyWebApi();
            spotifyApi.setAccessToken(token);
            if (current.is_playing) {
                spotifyApi.pause()
                    .catch(e => responseError('Failed to Pause', e));
            } else {
                spotifyApi.play()
                    .catch(e => responseError('Failed to Play', e));
            }
        }
    };

    return <Container className="my-3">
        <div style={{ display: 'grid', gridTemplateColumns: '130px 230px 1fr', maxWidth: 700, margin: 'auto', background: '#f3f3f3' }}>
            <div className="m-2">
                {current.item
                    ? <img src={current.item.album.images[0].url} alt={`${current.item.album.name} Album Art`} className="w-100" />
                    : <Spinner animation="border" />
                }
            </div>

            <div className="ml-1 d-flex flex-column justify-content-center">
                {current.item && <>
                    <p className="m-1">{current.item.name}</p>
                    <p className="m-1">{current.item.artists.map(a => a.name).join(', ')}</p>
                    <p className="m-1">{current.item.album.name}</p>
                </>}
            </div>

            <div className="p-3 align-self-center">
                <div>
                    <div className="text-center">
                        <IconButton onClick={onSkipPrevious} className="p-2">
                            <SkipPrevious fontSize="large" />
                        </IconButton>
                        <IconButton onClick={onPlayPauseToggle} className="p-2">
                            {current.is_playing
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
                        max={currentSongDuration}
                        onMouseDown={onUserStartSliding}
                        onMouseUp={onUserFinishedSliding}
                        onChange={onUserSlide}
                        className="py-1"
                    />
                </div>
            </div>
        </div>

        <div className="text-center mt-4">
            {lyrics
                ? <div style={{ whiteSpace: 'pre-wrap' }}>{lyrics}</div>
                : <Spinner animation="border" />
            }
        </div>
    </Container>;
};

export default TrackPlaying;

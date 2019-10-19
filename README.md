# Spotify Lyrics Viewer Online
View the lyrics of the current playing Spotify song in your browser

## Plan

### Frontend
- create-react-app (TypeScript)
- Bright fluorescent colours as the background with black/white text
    - Random on each entry but configurable in settings.
    - Background colour pulse/transition option
- Album art, song name, the artist at top (option to hide this). Lyrics down the page vertically (middle).
- No need for a nav as there is only one page

### Server
- API:
    - [Spotify Authorization Code Flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow)

### Flow
- Wait for one second over the song and poll every 5 seconds? (can increase/decrease this)
    - Also provide a refresh button
